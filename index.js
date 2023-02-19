const WebSocket = require("ws");
const express = require("express");
const WaveFile = require("wavefile").WaveFile;
require('dotenv').config()
const axios = require('axios');

const path = require("path")
const app = express();
const urlencoded = require('body-parser').urlencoded;
app.use(urlencoded({ extended: false }));
const server = require("http").createServer(app);
const wss = new WebSocket.Server({ server });
const LocalState = require('./states.js');
const { GetNextMessageSafe } = require('./getNextMessage.js');

let assembly;     // Assembly AI WebSocket
let chunks = [];  // Assembly AI WebSocket audio data chunks
let states;       // state of the software
let socket;       // Twilio WebSocket
let callObject;   // call state object

async function TalkSafe(socket, localStates, text) {
  try {
    const data = await localStates.TextToSpeech(text);
    console.log('AI: ' + text);
  
    // remove the header
    const audioContent = data.payload;
    const binaryData = new Buffer.from(audioContent);
    // const headerlessBinaryData = binaryData.slice(58);
    const headerlessBinaryData = removeWaveHeader(binaryData);
    const base64String = headerlessBinaryData.toString('base64');
  
    const message = {
      event: 'media',
      streamSid: data.streamSid,
      media: {
        payload: base64String,
      },
    };
    
    messageJSON = JSON.stringify(message);
    socket.send(messageJSON);
    return true;
  }
  catch (err) {
    console.log(err);
    return false;
  }
}

const hangupJSON = JSON.stringify({
  event: "hangup",
});

function removeWaveHeader(audio) {

  const header = audio.slice(0, 44);
  const format = header.slice(0, 4).toString();
  if (format !== 'RIFF') {
    throw new Error('Not a valid WAV file');
  }
  
  const chunkSize = header.readUInt32LE(4);
  const subFormat = header.slice(8, 12).toString();
  if (subFormat !== 'WAVE') {
    throw new Error('Not a valid WAV file');
  }
  
  const dataIndex = audio.slice(0, 256).toString().indexOf("data");
  if (dataIndex === -1) {
    throw new Error('Not a valid WAV file');
  }
  
  const audioDataStart = dataIndex + 8;   // 4 bytes for size + 4 bytes for "data"
  console.log('audioDataStart: ' + audioDataStart);
  const audioData = audio.slice(58);
  
  // audioData now contains the audio data without the wave header
  return audioData;
}

// Handle Web Socket Connection
wss.on("connection", function connection(ws) {
  socket = ws;
  console.log("New Connection Initiated");

  ws.on("message", function incoming(message) {
    if (!assembly)
      return console.error("AssemblyAI's WebSocket must be initialized.");

    const msg = JSON.parse(message);
    switch (msg.event) {
      case "connected":
        console.log(`A new call has connected.`);
        assembly.onerror = console.error;
        const texts = {};
        assembly.onmessage = (assemblyMsg, extra) => {
          // const msg = getAssemblyMessage(texts, assemblyMsg.data);
          const msg = states.GetAssemblyMessage(assemblyMsg.data);
          states.SetText(msg);
          console.log(states.Message);
          // if (states.IsChanged && states.IsSentenceEnded) {
          //   void async function () {
          //     await TalkSafe(socket, states, 'yeah');
          //   }().catch(err => console.log(err));
          // }
          if (states.IsItTimeToRespond) {
            void async function () {
              const reply = callObject.getters.Reply;
              await TalkSafe(socket, states, reply);
              const result = await GetNextMessageSafe(callObject, states.Message);
              if (result.success) {
                callObject = result.callObject;
                await TalkSafe(socket, states, result.message);
              }
              else
                console.log('Error getting call state.');
              states.Reset();
            }().catch(err => console.log(err));
          }
        };
        break;
      case "start":
        console.log(`Starting Media Stream ${msg.streamSid}`);
        states.StreamSid = msg.streamSid;
        states.CallSid = msg.start.callSid;
        void async function () {
          const result = await GetNextMessageSafe(callObject, '')
          if (result.success) {
            callObject = result.callObject;
            TalkSafe(socket, states, result.message).then('Introduction message')
          }
          else
            console.log('Error getting call state.');
        }().catch((err) => {
          console.log(err);
        });
        break;
      case "media":
        const twilioData = msg.media.payload;
        // Build the wav file from scratch since it comes in as raw data
        let wav = new WaveFile();

        // Twilio uses MuLaw so we have to encode for that
        wav.fromScratch(1, 8000, "8m", Buffer.from(twilioData, "base64"));
        
        // This library has a handy method to decode MuLaw straight to 16-bit PCM
        wav.fromMuLaw();
        
        // Get the raw audio data in base64
        const twilio64Encoded = wav.toDataURI().split("base64,")[1];
        
        // Create our audio buffer
        const twilioAudioBuffer = Buffer.from(twilio64Encoded, "base64");
                    
        // Send data starting at byte 44 to remove wav headers so our model sees only audio data
        chunks.push(twilioAudioBuffer.slice(44));
                    
        // We have to chunk data b/c twilio sends audio durations of ~20ms and AAI needs a min of 100ms
        if (chunks.length >= 5) {
          const audioBuffer = Buffer.concat(chunks);
          const encodedAudio = audioBuffer.toString("base64");
          assembly.send(JSON.stringify({ audio_data: encodedAudio, streamSid: msg.streamSid }));
          chunks = [];
        }
        break;
      case "stop":
        console.log(`Call Has Ended`);
        assembly.send(JSON.stringify({ terminate_session: true }));
        break;
    }
  });
});

//Handle HTTP Request
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "/index.html")));

app.post("/voice", async (req, res) => {
  const call = {
    called: req.body.Called,
    caller: req.body.Caller,
    callSid: req.body.CallSid,
    fromCity: req.body.FromCity,
    fromState: req.body.FromState
  };
  callObject = { phone: call };
  states = new LocalState();
  assembly = new WebSocket(
    "wss://api.assemblyai.com/v2/realtime/ws?sample_rate=8000",
    { headers: { authorization: process.env.ASSEMBLYAI_API_KEY } }
  );
  
  res.send(`
    <Response>
      <Connect>
        <Stream url='wss://${req.headers.host}' >
          <Parameter name="StreamNumber" value="2131231234" />
        </Stream>
      </Connect>
    </Response>
  `);
});

app.post('/status', async(req, res) => {
  console.log(req.body);
  res.send('OK');
});


app.get('/ping', (req, res) => {
  res.send('pong');
});

// Start server
console.log("Listening at Port 3000");
server.listen(process.env.PORT || 3000);
