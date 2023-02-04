const textToSpeech = require('@google-cloud/text-to-speech');
require('dotenv').config();

// console.log('env: ' + process.env.GOOGLE_APPLICATION_CREDENTIALS)

const fs = require('fs');
const util = require('util');

const client = new textToSpeech.TextToSpeechClient();

async function GenerateSpeech(text) {
  const outputFile = `./soundbytes/${text.replace(' ', '-')}.mp3`;
  // if (!rawOnly && fs.existsSync(outputFile)) {
  //   // console.log(`Audio content written to file: ${outputFile}`);
  //   return;
  // }
  /**
   * TODO(developer): Uncomment the following lines before running the sample.
   */
  // const ssml = "<speak>Canada said on Friday that it was monitoring \"a potential second incident\" involving a surveillance balloon, but did not say which country could be behind it. It said in the statement that it is working closely with the US to \"safeguard Canada's sensitive information from foreign intelligence threats\". The object flew over Alaska's Aleutian Islands and through Canada before appearing over the city of Billings in Montana on Wednesday, officials said. A senior defence official speaking on condition of anonymity said the government prepared fighter jets, including F-22s, in case the White House ordered the object to be shot down.</speak>";
  const ssml = `<speak>${text}</speak>`;

  // const request = {
  //   input: {ssml: ssml},
  //   voice: {languageCode: 'en-US', ssmlGender: 'FEMALE'},
  //   audioConfig: {audioEncoding: 'MP3'},
  // };

  const request = {
    input: {ssml: ssml},
    // Select the language and SSML voice gender (optional)
    voice: {
      languageCode: 'en-US',
      ssmlGender: 'FEMALE',
      name: "en-US-Wavenet-H"
    },
    // select the type of audio encoding
    audioConfig: {
      effectsProfileId: [
        "headphone-class-device"
      ],
      pitch: -1,
      speakingRate: 1.0,
      audioEncoding: "MULAW"
    },
  };

  const [response] = await client.synthesizeSpeech(request);
  return response.audioContent;
}

function SpeechFileName(text) {
  const outputFile = `./soundbytes/${text.replace(' ', '-')}.ulaw`;
  return outputFile;
}

async function SaveSpeechFile(text, data) {
  const outputFile = SpeechFileName(text);
  const writeFile = util.promisify(fs.writeFile);
  await writeFile(outputFile, data, 'binary');
  return outputFile;
}

// GenerateSpeech().catch(console.error);
module.exports = { GenerateSpeech, SpeechFileName, SaveSpeechFile };
