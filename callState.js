const _ = require('lodash');

class CallState {

    constructor() {
        this._state = {};
        this._transcriptIndex = 0;
        this._userInput = '';
        this._confidence = 0;
        this._called = '';
        this._caller = '';
        this._callSid = '';
        this._fromCity = '';
        this._fromState = '';
    }

    get Called () {
        return this._called;
    }

    set Called(called) {
        this._called = called;
    }

    get Caller() {
        return this._caller;
    }

    set Caller(caller) {
        this._caller = caller;
    }

    set CallSid(callSid) {
        this._callSid = callSid;
    }

    set FromCity(fromCity) {
        this._fromCity = fromCity;
    }

    set FromState(fromState) {
        this._fromState = fromState;
    }

    get State() {
        return this._state;
    }

    get CopyState() {
        return JSON.parse(JSON.stringify(this._state));
    }

    set State(state) {
        this._state = JSON.parse(JSON.stringify(state));
    }

    get LastMessage() {
        if (!this._state.transcript || this._state.transcript.length === 0)
            return '';
        const arr = this._state.transcript.slice(this._transcriptIndex);
        this._transcriptIndex = this._state.transcript.length;
        const aiMessages = arr.filter(obj => obj.name === 'AI');
        const message = _.map(aiMessages, 'text').join(' ');
        return message;
    }

    get UserInput() {
        return this._userInput;
    }

    set UserInput(userInput) {
        this._userInput = userInput;
    }

    get Confidence() {
        return this._confidence;
    }

    set Confidence(confidence) {
        this._confidence = confidence;
    }

    get Reply() {
        try {
            const id = this._state.id;
            const gpt3s = this._state.gpt3;
            const gpt3 = gpt3s.find(obj => obj.id === id);
            const reply = gpt3.reply;
            return reply;
        }
        catch (err) {
            return 'Okay.';
        }
    }

    get SpeechTimeout() {
        try {
            const id = this._state.id;
            const gpt3s = this._state.gpt3;
            const gpt3 = gpt3s.find(obj => obj.id === id);
            const timeout = gpt3.speechtimeout;
            return timeout === 0 ? 1.5 : timeout.toString();
        }
        catch (err) {
            return 'Okay.';
        }
    }

    get Status() {
        const gpt3s = this._state.gpt3;
        const filtered = gpt3s.filter(obj => ('q' in obj));
        const result = filtered.reduce((total, curr) => {
            const regex = /\"q\"\s*:\s*\"(.*?)\"/;
            const question = curr.q.match(regex)[1];
            const answer = curr.a;
            total = `${total}\n ${question} - ${answer}`;
            return total;
        }, '');
        return result;
    }

    get IsPhoneCallEnd() {
        try {
            const id = this._state.id;
            const gpt3s = this._state.gpt3;
            const gpt3 = gpt3s.find(obj => obj.id === id);
            return (obj.type === 'goodbye');
        }
        catch (err) {
            return false;
        }
    }

    get Transcript() {
        try {
            const data = `Called: ${this._called}\nCaller: ${this._caller}\nCallSid: ${this._callSid}\nFromCity: ${this._fromCity}\nFromState: ${this._fromState}\n\n`;
            const arrLength = this._state.transcript.length;
            const trans = this._state.transcript.reduce((sum, curr, index) => {
                const extra = (index < arrLength - 1 ? '\n' : '');
                return sum + `${curr.name}: ${curr.text} ${extra}`;
            }, data);
            return trans;
        }
        catch (err) {
            console.log(err);
            return 'transcript not found.';
        }
    }

}

module.exports = CallState;
