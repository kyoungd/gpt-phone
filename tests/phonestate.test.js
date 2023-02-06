const CallState = require('../callState.js');
const GetNextMessage = require('../getNextMessage.js');
const firstResponse = require('./data/first_response.json');

describe('States', () => {
    let phoneCallState;

    beforeEach(() => {
        phoneCallState = new CallState();
    });
    
    // it('initalize OK', () => {
    //     const message = phoneCallState.LastMessage;
    //     expect(message).toBe('');
    // });

    // it('set state check', () => { 
    //     phoneCallState.State = firstResponse;
    //     const firstMessage = phoneCallState.LastMessage;
    //     expect(firstMessage.length).toBeGreaterThan(0);
    // });

    // it('first message from api', async () => {
    //     const blank = {};
    //     const result = await GetNextMessage(blank, '');
    //     expect(result.status).toBe(200);
    //     phoneCallState.State = result.data;
    //     const firstMessage = phoneCallState.LastMessage;
    //     expect(firstMessage.length).toBeGreaterThan(0);
    // });

    it('next message from api', async () => {
        phoneCallState.State = firstResponse;
        const result1 = await GetNextMessage(phoneCallState.State, 'I got into an accident three days ago.  Can you help?');
        expect(result1.status).toBe(200);
        phoneCallState.State = result1.data;
        expect(phoneCallState.State.id).toBe(200);
        const secondMessage = phoneCallState.LastMessage;
        expect(secondMessage.length).toBeGreaterThan(0);
        //
        r2 = "It was three day ago, at 7:00 PM and John, my brother, was driving home from work. He had been looking forward to getting home to see his family and relax after a long day. He was driving on a busy highway, and traffic was heavy. Suddenly, out of nowhere, a car came speeding into his lane and hit him head-on. John's car spun out of control, and he felt a sharp pain in his chest as his seatbelt tightened. The airbags deployed, and he heard the sound of metal crunching. His car finally came to a stop on the side of the road, and he was trapped inside. He was dazed and confused and could feel the blood running down his face from a cut on his forehead. The other driver was also injured, and he stumbled out of his car. The police arrived shortly after, and the paramedics were called to the scene. John was carefully extracted from his car, and he was rushed to the hospital with serious injuries. He is at the hospital recovering in the hospital with broken ribs, a collapsed lung and head injury with couple of stitches."
        const result2 = await GetNextMessage(phoneCallState.State, r2);
        expect(result2).not.toBe(null);
        expect(result2.status).toBe(200);
        phoneCallState.State = result2.data;
    });

});
