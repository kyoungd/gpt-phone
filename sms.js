const twilio = require('twilio');
require('dotenv').config()

// Your Account SID and Auth Token from twilio.com/console
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

class SMS {
    constructor() {
        this.messages = [];
    }

    async SendSMS(fromNumber, toNumber, message) {
        const result = await client.messages.create({
            body: message,
            from: fromNumber,
            to: toNumber
        });
        this.messages.push(result);
        return result;
    }

    async SendSMSFromState(callPhoneState) {
        await this.SendSMS(callPhoneState.Called, callPhoneState.Caller, callPhoneState.Transcript);
        return true;
    }

}

module.exports = SMS;

// 
// law office - brief description of how I can help you.  I'll get you to the right person.
// phone number or email address
// name
// 

