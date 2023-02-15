# twilio number
(323) 641-4381

ngrok
# launch ngroke for local testing.
# and copy the URL to twilio website webhook for this number.
ngrok http 8080





Extract the information from the following paragraph and answer them in the json format.
1. { "q" : "name of the caller", "a" : "name" or "did not say" }
2. { "q" : "Is the caller involved in the accident", "a" : "yes" or "no" or "did not say" 
4. { "q" : "was there injury", "a" : "severe", "mild", or "none" or "did not say" }
5. { "q" : "was there pain", "a" : "severe", "mild" or "none" or "did not say" }
6. { "q" : "location of the accident", "a" : "location" or "did not say" }
7. { "q" : "when was the accident", "a" : "time" or "did not say" }
8. { "q" : "is there a witness", "a" : "yes" or "no" or "did not say" }
9. { "q" : "whos fault is it", "a" : "name" or "did not say" }
10. { "q" : "what happened at the accident", "a" : "description" or "did not say" }
11. { "q" : "Your name", "a" : "name" or "did not say" }
12. { "q" : "your phone number", "a": "number" or "did not say" }
I was in an accident last week and was injured when I was hit from the rear.


            // states.TextToSpeech('Hello there, Young.  Nice to see you again.')
            //   .then((data) => {
            //     console.log('Sending audio back.');

            //     // remove the header
            //     const audioContent = data.payload;
            //     const binaryData = new Buffer.from(audioContent);
            //     // const headerlessBinaryData = binaryData.slice(58);
            //     const headerlessBinaryData = removeWaveHeader(binaryData);
            //     const base64String = headerlessBinaryData.toString('base64');

            //     const message = {
            //       event: 'media',
            //       // callSid: data.callSid,
            //       streamSid: data.streamSid,
            //       media: {
            //         payload: base64String,
            //       },
            //     };
            //     messageJSON = JSON.stringify(message);
            //     // write to a temp file
            //     fs.writeFileSync('temp.wav', audioContent);
            //     fs.writeFileSync('temp-nohead.wav', headerlessBinaryData);
            //     fs.writeFileSync('temp.json', messageJSON);

            //     socket.send(messageJSON);
            //     states.Reset();
            //   })
            //   .catch((err) => console.error(err));

          // wss.clients.forEach( client => {
          //   if (client.readyState === WebSocket.OPEN) {
          //     client.send(
          //       JSON.stringify({
          //         event: "interim-transcription",
          //         text: states.Message
          //       })
          //     );
          //   }
          // });


Extract the information from the following paragraph and answer them in the json format.
1. { "q" : "name of the caller", "a" : "name" or "did not say" }
2. { "q" : "Is the caller involved in the accident", "a" : "yes" or "no" or "did not say" 
4. { "q" : "was there injury", "a" : "severe", "mild", or "none" or "did not say" }
5. { "q" : "was there pain", "a" : "severe", "mild" or "none" or "did not say" }
6. { "q" : "location of the accident", "a" : "location" or "did not say" }
7. { "q" : "when was the accident", "a" : "time" or "did not say" }
8. { "q" : "is there a witness", "a" : "yes" or "no" or "did not say" }
9. { "q" : "whos fault is it", "a" : "name" or "did not say" }
10. { "q" : "what happened at the accident", "a" : "description" or "did not say" }
11. { "q" : "Your name", "a" : "name" or "did not say" }
12. { "q" : "your phone number", "a": "number" or "did not say" }
"It was three day ago, at 7:00 PM and John, my brother, was driving home from work. He had been looking forward to getting home to see his family and relax after a long day. He was driving on a busy highway, and traffic was heavy. Suddenly, out of nowhere, a car came speeding into his lane and hit him head-on.
John's car spun out of control, and he felt a sharp pain in his chest as his seatbelt tightened. The airbags deployed, and he heard the sound of metal crunching. His car finally came to a stop on the side of the road, and he was trapped inside. He was dazed and confused and could feel the blood running down his face from a cut on his forehead.
The other driver was also injured, and he stumbled out of his car. The police arrived shortly after, and the paramedics were called to the scene. John was carefully extracted from his car, and he was rushed to the hospital with serious injuries.  He is at the hospital recovering in the hospital with broken ribs, a collapsed lung and head injury with couple of stitches."
