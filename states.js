const { GenerateSpeech } = require('./text2speech.js');

class States {
    constructor(time_pause = null) {
        this.texts = {};
        this.time_pause = time_pause === null ? 5000 : time_pause;
        this.last_state = {
            updated_at: null,
            text: '',
        };
        this._streamSid = null;
        this._isGeneratingSpeech = false;
        this._isTalking = false;
    }

    get Message() {
        return this.last_state.text;
    }

    get IsItTimeToRespond() {
        if (this._isGeneratingSpeech || this._isTalking)
            return false;
        return this.isTimeToRespond();
    }

    set StreamSid(sid) {
        this._streamSid = sid;
    }

    get StreamSid() {
        return this._streamSid;
    }

    GetAssemblyMessage(data, texts = this.texts) {
        const res = JSON.parse(data);
        texts[res.audio_start] = res.text;
        const keys = Object.keys(texts);
        keys.sort((a, b) => a - b);
        let msg = '';
        for (const key of keys) {
            if (texts[key]) {
                msg += ` ${texts[key]}`;
            }
        }
        return msg;
    }

    getTimestamp() {
      return (new Date().getTime());
    }

    SetText(text) {
        // length of string, text
        if (text && text.length > 0 && this.last_state.text !== text) {
            this.last_state = {
                updated_at: this.getTimestamp(),
                text: text,
            }
            this._isTalking = false;
        }
    }

    isSentenceEnd() {
        const text = this.last_state.text.trim();
        if (text.length <= 0)
            return false;
        // last character in text is a '.'
        const last_char = text[text.length - 1];
        if (last_char === '.' || last_char === '?')
            return true;
        return false;
    }

    isTimeToRespond(last_state = this.last_state) {
        if (last_state.updated_at === null)
            return false;
        const inMilliseconds = this.getTimestamp() - last_state.updated_at;
        // last character in text is a '.'
        const wait_time = this.isSentenceEnd() ? this.time_pause / 2 : this.time_pause;
        return (inMilliseconds > wait_time);
    }

    async TextToSpeech(text) {
        if (this._isGeneratingSpeech)
            return null;
        this._isGeneratingSpeech = true;
        this._isTalking = true;
        const raw = await GenerateSpeech(text);
        this._isGeneratingSpeech = false;
        return { payload: raw, streamSid: this._streamSid };
    }

}

module.exports = States;
