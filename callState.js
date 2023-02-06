const _ = require('lodash');

class CallState {

    constructor() {
        this._state = {};
        this._transcriptIndex = 1;
        this._userInput = '';
        this._confidence = 0;
    }

    get State() {
        return this._state;
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

}

module.exports = CallState;
