const WebSocket = require("ws");
const express = require("express");
const WaveFile = require("wavefile").WaveFile;
require('dotenv').config()

const path = require("path")
const app = express();
const server = require("http").createServer(app);
const wss = new WebSocket.Server({ server });
const CallStates = require('./states.js');

let assembly;
let chunks = [];
let states;
let socket;

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
          if (states.IsChanged && states.IsSentenceEnded) {
            console.log('Yeah.');
          }
          if (states.IsItTimeToRespond) {
            console.log('Sending Message Back');
            states.TextToSpeech('Hello there, Young.  Nice to see you again.')
              .then((data) => {
                console.log('Sending audio back.');
                const binaryData = data.payload;
                // const binaryData = new Buffer.from(audioContent);
                const base64String = binaryData.toString('base64');
                const message = {
                  event: 'media',
                  streamSid: data.streamSid,
                  media: {
                    track: 'outbound', 
                    payload: base64String,
                  },
                };
                socket.send(JSON.stringify(message));
              })
              .catch((err) => console.error(err));
          }
          wss.clients.forEach( client => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  event: "interim-transcription",
                  text: states.Message
                })
              );
            }
          });
        };
        break;
      case "start":
        console.log(`Starting Media Stream ${msg.streamSid}`);
        states.StreamSid = msg.streamSid;
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
  states = new CallStates();
  assembly = new WebSocket(
    "wss://api.assemblyai.com/v2/realtime/ws?sample_rate=8000",
    { headers: { authorization: process.env.ASSEMBLYAI_API_KEY } }
  );
  
  res.set("Content-Type", "text/xml");
  res.send(
    `<Response>
       <Start>
         <Stream url='wss://${req.headers.host}' >
          <Parameter name="StreamNumber" value ="2131231234"/>
         </Stream>
       </Start>
       <Say voice="Polly.Joanna">
         Start speaking to see your audio transcribed in the console
       </Say>
       <Pause length='30' />
     </Response>`
  );
});

app.post('/status', async(req, res) => {
  console.log(req.body);
  res.send('OK');
});

// Start server
console.log("Listening at Port 8080");
server.listen(8080);



// function getAssemblyMessage(texts, data) {
//   const res = JSON.parse(data);
//   texts[res.audio_start] = res.text;
//   const keys = Object.keys(texts);
//   keys.sort((a, b) => a - b);
//   let msg = '';
//   for (const key of keys) {
//     if (texts[key]) {
//       msg += ` ${texts[key]}`;
//     }
//   }
//   return msg;
// }
