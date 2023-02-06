const axios = require('axios');
require('dotenv').config()

async function GetNextMessage (data, message) {
    try {        
        const url = process.env.REACT_APP_GPT3_URL || 'http://localhost:5000/callcenter';
        const block = { data: data, message };
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

module.exports = GetNextMessage;
