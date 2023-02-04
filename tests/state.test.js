const CallStates = require('../states.js');

describe('States', () => {
    let states;

    beforeEach(() => {
        states = new CallStates();
    });
    
    it('initalize OK', () => {
        expect(states.Message).toBe('');
        expect(states.IsItTimeToRespond).toBe(false);
    });

    it('SetText check', () => {
        states.SetText('Hello there.');
        expect(states.Message).toBe('Hello there.');
    });

    it('isSentenceEnd check', () => {
        states.SetText('Hello there.');
        expect(states.isSentenceEnd()).toBe(true);
        states.SetText('Hello');
        expect(states.isSentenceEnd()).toBe(false);
    });

    it('IsItTimeToRespond check 1', () => {
        states.SetText('Hello there.');
        const last_updated = states.last_state.updated_at;
        expect(states.IsItTimeToRespond).toBe(false);
        states.last_state.updated_at = last_updated - 2000;
        expect(states.IsItTimeToRespond).toBe(false);
        states.last_state.updated_at = last_updated - 4000;
        expect(states.IsItTimeToRespond).toBe(true);
    });

    it('IsItTimeToRespond check 2', () => {
        states.SetText('Hello');
        expect(states.IsItTimeToRespond).toBe(false);
        const last_updated = states.last_state.updated_at;
        states.last_state.updated_at = last_updated - 4000;
        expect(states.IsItTimeToRespond).toBe(false);
        states.last_state.updated_at = last_updated - 6000;
        expect(states.IsItTimeToRespond).toBe(true);
    });

    it('StreamSid check', () => {
        states.StreamSid = '123';
        expect(states.StreamSid).toBe('123');
    });

    it('Generating Speech 1', async () => {
        states.SetText('Hello there.');
        const last_updated = states.last_state.updated_at;
        states.last_state.updated_at = last_updated - 4000;
        expect(states.IsItTimeToRespond).toBe(true);
        const raw = await states.TextToSpeech('Good morning.');
        expect(raw).not.toBe(null);
        expect(states.IsItTimeToRespond).toBe(false);
        states.SetText('How are you doing?');
        states.last_state.updated_at = last_updated - 4000;
        expect(states.IsItTimeToRespond).toBe(true);
    });

    it('end of sentence reply test', () => {
        states.SetText('Hello there');
        const last_updated = states.last_state.updated_at;
        expect(states.IsChanged).toBe(true);
        expect(states.IsSentenceEnded).toBe(false);
        expect(states.IsItTimeToRespond).toBe(false);

        states.SetText('Hello there');
        expect(states.IsChanged).toBe(false);
        expect(states.IsSentenceEnded).toBe(false);
        states.SetText('Hello there');
        expect(states.IsChanged).toBe(false);
        expect(states.IsSentenceEnded).toBe(false);

        states.SetText('Hello there.');
        expect(states.IsChanged).toBe(true);
        expect(states.IsSentenceEnded).toBe(true);
        expect(states.IsItTimeToRespond).toBe(false);

        states.SetText('Hello there.');
        expect(states.IsChanged).toBe(false);

        states.last_state.updated_at = last_updated - 6000;
        expect(states.IsItTimeToRespond).toBe(true);
    });

});
