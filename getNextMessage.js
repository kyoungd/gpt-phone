const axios = require('axios');
require('dotenv').config()

async function GetNextMessage (data, message) {
    try {        
        const url = process.env.REACT_APP_GPT3_URL || 'http://localhost:5000/callcenter';
        const block = { call: data, reply: message };
        const result = await axios.post(url, block, {
            headers: {
              'Content-Type': 'application/json'
            }
        });
        return result;
    } catch (error) {
        console.log(error);
    }
}

async function GetNextMessageSafe(callObject, userInput) {
    try {
      const block = { call: callObject, reply: userInput }
      const url = process.env.CALL_STATE_URL || 'http://localhost:3001/state';
      const result = await axios.post(url, block, {
          headers: {
            'Content-Type': 'application/json'
          }
      });
      if (result.status === 200) {
        callObject = result.data.data;
        const message = callObject.getters.LastMessage;
        const reply = callObject.getters.Reply;
        return {success: true, message, reply, callObject};
      }
      console.log(result && result.status_coode ? result.status_code : 'UNKNOWN ERROR');
      return {success: false, message:'', reply:'', callObject};
    }
    catch (err) {
      console.log(err);
      return {success:false, message:'', reply:'', callObject};
    }
  }
  
module.exports = { GetNextMessage, GetNextMessageSafe };
