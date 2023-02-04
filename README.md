# twilio number
(323) 641-4381

ngrok
# launch ngroke for local testing.
# and copy the URL to twilio website webhook for this number.
ngrok http 8080



const textToSpeech = require('@google-cloud/text-to-speech');
const client = new textToSpeech.TextToSpeechClient();
const [response] = await client.synthesizeSpeech(request);
return response.audioContent;

{
  "event": "media",
  "streamSid": "MZ18ad3ab5a668481ce02b83e7395059f0",
  "media": {
    "payload": "a3242sadfasfa423242..."
  }
}

The payload is the u-law audio encoded in base64.  Can you write this code in nodejs?
