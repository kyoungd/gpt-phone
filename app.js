const express = require("express");
const urlencoded = require('body-parser').urlencoded;
const app = express();
const server = require("http").createServer(app);
const CallState = require('./callState.js');
const GetNextMessage = require('./getNextMessage.js');

require('dotenv').config()
app.use(urlencoded({ extended: false }));
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const voice = { voice: 'Polly.Kimberly', language: 'en-US' };

const phoneCallState = new CallState();

app.post("/voice", async (req, res) => {
    const blank = {};
    const result = await GetNextMessage(blank, '');
    phoneCallState.State = result.data;

    res.set("Content-Type", "text/xml");
    // res.send(
    //   `<Response>
    //      <Say voice="Polly.Joanna">
    //        This is Joanna from Accident Specialists.  How can I help you?
    //      </Say>
    //      <Gather
    //           input="speech"
    //           action="/acknolwedge"
    //           language= "en-US"
    //           speechModel="phone_call"
    //           speechTimeout="2"
    //      />
    //    </Response>`
    // );
    const twiml = new VoiceResponse();
    const gather = twiml.gather({
        input: 'speech',
        action: '/ack',
        language: 'en-US',
        speechModel: 'phone_call',
        speechTimeout: 2
    });
    gather.say(voice, 'This is Joanna from Accident Specialists.  How can I help you?');
    res.send(twiml.toString());
  });

  app.post('/ack', async (req, res) => {
    const userInput = req.body.SpeechResult;
    const confidence = req.body.Confidence;
    phoneCallState.UserInput = userInput;
    phoneCallState.Confidence = confidence;
    const twiml = new VoiceResponse();
    twiml.say(voice, `Got it.  Hold on.`);
    twiml.redirect({method: 'POST'}, `${process.env.SELF_URL}/answer`);
    res.send(twiml.toString());
  });

  app.post('/answer', async (req, res) => {
    const userInput = phoneCallState.UserInput;
    const twiml = new VoiceResponse();

    // process response from user and get the next question.
    const result1 = await GetNextMessage(phoneCallState.State, userInput)
    phoneCallState.State = result1.data;

    const message = phoneCallState.LastMessage;
    console.log('message at /answer: ', message);
    const gather = twiml.gather({
        input: 'speech',
        action: '/ack',
        language: 'en-US',
        speechModel: 'phone_call',
        speechTimeout: 2
    });
    gather.say(voice, message);
    res.send(twiml.toString());
  });

  app.post('/acknowledge', async (req, res) => {
    const userInput = req.body.SpeechResult;
    const confidence = req.body.Confidence;
    const twiml = new VoiceResponse();
    twiml.say(voice, `You said ${userInput} with a confidence of ${confidence}`);
    twiml.redirect({method: 'POST'}, '/results');
    res.send(twiml.toString());
  });

  app.post('/results', async (req, res) => {
    const twiml = new VoiceResponse();
    twiml.say(voice, `Thanks for calling.  Bye.`);
    twiml.hangup();
    res.send(twiml.toString());

  app.get('/ping', (req, res) => {
    res.send('pong');
  });

    // const userInput = req.body.SpeechResult;
    // const confidence = req.body.Confidence;
    // const twiml = new VoiceResponse();

    // twiml.say(voice, `You said ${userInput} with a confidence of ${confidence}`);
    // twiml.action="/voice";
    // const gather = twiml.gather({
    //     input: 'speech',
    //     action: '/results',
    //     language: 'en-US',
    //     speechModel: 'phone_call',
    //     speechTimeout: 2
    // });
    // gather.say(voice, 'Please tell me what happened.');
    // res.send(twiml.toString());
  });

  // Start server
  console.log("Listening at Port 8080");
  server.listen(8080);
  