const fs = require('fs');
const { GenerateSpeech } = require('../text2speech.js');

describe('Text to speech test', () => {

    it('use google to generate speech', async() => {
        const text = 'Nearly 100 million people in Canada and the US brace for some of the coldest air on earth, as a record-breaking deep freeze hits North America.';
        const raw = await GenerateSpeech(text);
        expect(raw).not.toBeNull();
    });

});
