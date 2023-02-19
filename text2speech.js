const axios = require('axios');

require('dotenv').config();

// console.log('env: ' + process.env.GOOGLE_APPLICATION_CREDENTIALS)


async function GenerateSpeech(text) {
  const url = process.env.TTS_URL || 'http://localhost:3001/tts';
  const result = await axios.post(url, { text }, {
      headers: {
        'Content-Type': 'application/json'
      }
  });
  if (result.status === 200) {
    return result.data.data.data;
  }
}

// GenerateSpeech().catch(console.error);
module.exports = { GenerateSpeech };
