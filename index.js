const express = require('express');
const app = express();
const path = require('path');
app.set('port', (process.env.PORT || 5000));
app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname + '/views/index.html'));
}).listen(app.get('port'), function () {
    console.log('App is running, server is listening on port ', app.get('port'));
});

const fs = require("fs");
const T = require('./modules/T');
const usernames = require('./modules/usernames');


/* ******************

 Responses

 ******************* */

const responses = [
    {
        text: 'kInDlY fOlLoW bAcK pLs',
        image: 'images/spongebob.jpg'
    },
    {
        text: 'But did they ask you to follow them?',
        image: 'images/ooo.png'
    },
    {
        text: 'But did they ask you to follow them?',
        image: 'images/annoyed_child.png'
    }
];


/* ******************

 Stream

 ******************* */

console.log(usernames.join(','));

const stream = T.stream('statuses/filter', { track: usernames.join(','), language: 'en' });

stream.on('tweet', (tweet) => {

    if ( tweet.user.screen_name == 'kfb_police' ) return;
    if ( tweet.retweeted_status ) return;

    const tweetLC = tweet.text.toLowerCase();
    const asker = tweet.user.screen_name;
    const askee = tweetLC.split('@')[1].split(' ')[0] || '';

    if ( asker == askee ) return;

    console.log("Tweet Seen");

    if ( tweetLC.indexOf('kfb') > -1 | 
         tweetLC.indexOf('ffb') > -1 |
         tweetLC.indexOf(' fb') > -1 |
         ( tweetLC.indexOf('follow') > -1 && tweetLC.indexOf('back') > -1 ) 
       ) {
   
        console.log("Tweet Applies: ", tweetLC);

        const randomResponse = responses[Math.floor(Math.random() * responses.length)]; 

        const b64content = fs.readFileSync(randomResponse.image, { encoding: 'base64' })
        T.post('media/upload', { media_data: b64content }, function (err, data, response) {

            const reply = {
                status: `@${asker} @${askee} ${randomResponse.text}`,
                in_reply_to_status_id: tweet.id_str,
                media_ids: [data.media_id_string]
            };

            console.log("Media Uploaded: ", data.media_id_string);

            T.post('statuses/update', reply, function(err, data, response) {
                if ( err ) {
                    console.log(err);
                } else {
                    console.log("Reply Sent: ", data.text);
                } 
            });
        });



    }
});
