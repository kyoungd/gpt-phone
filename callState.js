const _ = require('lodash');

class CallState {

    constructor() {
        this._state = {};
        this._transcriptIndex = 0;
        this._userInput = '';
        this._confidence = 0;
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

}

module.exports = CallState;
