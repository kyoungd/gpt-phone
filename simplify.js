const WebSocket = require("ws");
const express = require("express");

require('dotenv').config()

const app = express();
const server = require("http").createServer(app);
const wss = new WebSocket.Server({ server });

// set interval to run function

// Handle Web Socket Connection
wss.on("connection", function connection(ws) {
  console.log("New Connection Initiated");

  ws.on("message", function incoming(message) {
    if (!assembly)
      return console.error("AssemblyAI's WebSocket must be initialized.");

    const msg = JSON.parse(message);
    switch (msg.event) {
      case "connected":
        console.log(`A new call has connected.`);
        break;
      case "start":
        console.log(`Starting Media Stream ${msg.streamSid}`);
        break;
      case "media":
        const twilioData = msg.media.payload;
        // Build the wav file from scratch since it comes in as raw data
        break;
      case "stop":
        console.log(`Call Has Ended`);
        break;
    }
  });
});

app.post('/voice', (req, res) => {

  res.set("Content-Type", "text/xml");
  res.send(
    `<Response>
       <Start>
         <Stream url='wss://${req.headers.host}' />
       </Start>
       <Say voice="Polly.Joanna">
         Start speaking to see your audio transcribed in the console
       </Say>
       <Pause length='30' />
     </Response>`
  );
});

// Start server
console.log("Listening at Port 8080");
server.listen(8080);

//
// A call comes in from Twilio, and I am using Webhook and Stream.  The audio is coming in and I am doing some processing on it.
// I need you to update this program and play an audio file every 30 seconds to the caller.
// ** Once your server has the audio in u-law format with a sample rate of 8000Hz, you can send the audio back to Twilio via the Media Message - https://www.twilio.com/docs/voice/twiml/stream#message-media-to-twilio
// In the future, I will use a text-to-speech engine to generate the audio, but for now, I will use a pre-recorded audio file.
//
// Is this something you can do?
//
