const express = require("express");
const urlencoded = require('body-parser').urlencoded;
const app = express();
const server = require("http").createServer(app);
const CallState = require('./callState.js');
const GetNextMessage = require('./getNextMessage.js');

require('dotenv').config()
app.use(urlencoded({ extended: false }));
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const voice = { voice: 'Polly.Salli-Neural', language: 'en-US' };

let phoneCallState;

app.post("/voice", async (req, res) => {
    phoneCallState = new CallState();
    const blank = {};
    const result = await GetNextMessage(blank, '');
    phoneCallState.State = result.data;
    const message = phoneCallState.LastMessage;

    res.set("Content-Type", "text/xml");
    const twiml = new VoiceResponse();
    const gather = twiml.gather({
        input: 'speech',
        action: '/ack',
        language: 'en-US',
        speechModel: 'phone_call',
        speechTimeout: phoneCallState.SpeechTimeout
    });
    gather.say(voice, message);
    res.send(twiml.toString());
  });

  app.post('/ack', async (req, res) => {
    const userInput = req.body.SpeechResult;
    const confidence = req.body.Confidence;
    phoneCallState.UserInput = userInput;
    phoneCallState.Confidence = confidence;
    const message = phoneCallState.Reply;
    const twiml = new VoiceResponse();
    twiml.say(voice, message);
    twiml.redirect({method: 'POST'}, `${process.env.SELF_URL}/answer`);
    res.send(twiml.toString());
  });

  app.post('/answer', async (req, res) => {
    const userInput = phoneCallState.UserInput;
    const twiml = new VoiceResponse();

    // process response from user and get the next question.
    const result1 = await GetNextMessage(phoneCallState.State, userInput)
    if (result1.status === 200) {
      try {
        phoneCallState.State = result1.data;

        console.log(phoneCallState.Status);
    
        const message = phoneCallState.LastMessage;
        const gather = twiml.gather({
            input: 'speech',
            action: '/ack',
            language: 'en-US',
            speechModel: 'phone_call',
            speechTimeout: phoneCallState.SpeechTimeout
        });
        gather.say(voice, message);
        if (phoneCallState.IsPhoneCallEnd)
          twiml.hangup();
        res.send(twiml.toString());    
      }
      catch (err) {
        console.log(err);
        twiml.say(voice, 'Hold on.  Give me a second here.');
        twiml.redirect({method: 'POST'}, `${process.env.SELF_URL}/answer`);
        res.send(twiml.toString());
      }
    }
    else {
      twiml.say(voice, 'Hold on.  Give me a second here.');
      twiml.redirect({method: 'POST'}, `${process.env.SELF_URL}/answer`);
      res.send(twiml.toString());
    }
  });

  app.get('/ping', (req, res) => {
    res.send('pong');
  });

  // Start server
  console.log("Listening at Port 3000");
  server.listen(process.env.PORT || 3000);
  