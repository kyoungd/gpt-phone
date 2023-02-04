# twilio number
(323) 641-4381

ngrok
# launch ngroke for local testing.
# and copy the URL to twilio website webhook for this number.
ngrok http 8080


const server = require("http").createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", function connection(ws) {
  socket = ws;
...
            states.TextToSpeech('Hello there, Young.  Nice to see you again.')
              .then((data) => {
                console.log('Sending audio back.');
                const audioContent = data.payload;
                const binaryData = new Buffer.from(audioContent);
                const base64String = binaryData.toString('base64');
                const message = {
                  event: 'media',
                  streamSid: data.streamSid,
                  media: {
                    payload: base64String,
                  },
                };
                socket.send(JSON.stringify(message));
              })
              .catch((err) => console.error(err));

I am using Google text-to-speech AI to generate a MULAW (μ-law) format audio.  I encoded the resulting audio file to base64. And I sent it back to the socket.
However, I am not hearing anything.  What am I missing?
Also, I checked the log file, and I did not see anything.  Is there some kind of debug mode that I can setup for testing?

