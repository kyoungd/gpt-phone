const CallState = require('../callState.js');
const { GetNextMessageSafe } = require('../getNextMessage.js');
const firstResponse = require('./data/first_response.json');
const secondResponse = require('./data/second_response.json');
const SMS = require('../sms.js');

describe('phone call state', () => {
    jest.setTimeout(30000);
    let phoneCallState;
    let callObject = null;

    beforeEach(() => {
        phoneCallState = new CallState();
    });
    
    it('initalize OK', () => {
        const message = phoneCallState.LastMessage;
        expect(message).toBe('');
    });

    it('set state check', () => { 
        phoneCallState.State = firstResponse;
        const firstMessage = phoneCallState.LastMessage;
        expect(firstMessage.length).toBeGreaterThan(0);
    });

    it('first message from api', async () => {
        const blank = {};
        const result = await GetNextMessageSafe(blank, '');
        expect(result.success).toBe(true);
        callObject = result.callObject;
        const firstMessage = callObject.getters.LastMessage;
        expect(firstMessage.length).toBeGreaterThan(0);
    });

    it('next message from api', async () => {
        const result1 = await GetNextMessageSafe(callObject, 'I got into an accident three days ago.  Can you help?');
        expect(result1.success).toBe(true);
        callObject = result1.callObject;
        expect(callObject.state.id).toBe(200);
        expect(callObject.getters.Reply).toBe('Hold on.  I am writing it down.');
        const secondMessage = callObject.getters.LastMessage;
        expect(secondMessage.length).toBeGreaterThan(0);
        //
    });

    it('third message from api', async () => {
        r2 = "It was three day ago, at 7:00 PM and John, my brother, was driving home from work. He had been looking forward to getting home to see his family and relax after a long day. He was driving on a busy highway, and traffic was heavy. Suddenly, out of nowhere, a car came speeding into his lane and hit him head-on. John's car spun out of control, and he felt a sharp pain in his chest as his seatbelt tightened. The airbags deployed, and he heard the sound of metal crunching. His car finally came to a stop on the side of the road, and he was trapped inside. He was dazed and confused and could feel the blood running down his face from a cut on his forehead. The other driver was also injured, and he stumbled out of his car. The police arrived shortly after, and the paramedics were called to the scene. John was carefully extracted from his car, and he was rushed to the hospital with serious injuries. He is at the hospital recovering in the hospital with broken ribs, a collapsed lung and head injury with couple of stitches."
        const result2 = await GetNextMessageSafe(callObject, r2);
        expect(result2).not.toBe(null);
        expect(result2.success).toBe(true);
        callObject = result2.callObject;
        expect(callobject.getters.Reply).toBe('Yes.');
    }, 15000);

    it('test printing out transcript', async () => {
        // phoneCallState.State = secondResponse;
        // const trans = phoneCallState.Transcript;
        // expect(trans).not.toBe(null);
        // phoneCallState.Called = "+13236414381";
        // phoneCallState.Caller = "+18186793565";
        // phoneCallState.CallSid = "0";
        // phoneCallState.FromCity = "Burbank";
        // phoneCallState.FromState = "CA";
        // const smsText = new SMS();
        // await smsText.SendSMSFromState(phoneCallState);
    });

});
