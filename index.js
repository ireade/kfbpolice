const express = require('express');
const app = express();
const path = require('path');
app.set('port', (process.env.PORT || 5000));
app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname + '/views/index.html'));
}).listen(app.get('port'), function () {
    console.log('App is running, server is listening on port ', app.get('port'));
});

const T = require('./modules/T');

const usernames = require('./modules/usernames');


/* ******************

 Responses

 ******************* */

const responses = [
    {
        text: 'kInDlY fOlLoW bAcK pLs',
        image_id: '877169780758908928'
    },
    {
        text: 'But did they ask you to follow them?',
        image_id: '877172696781643777'
    },
    {
        text: 'But did they ask you to follow them?',
        image_id: '877172812527665152'
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

    console.log("Tweet Seen: ", tweetLC);

    if ( tweetLC.indexOf('kfb') > -1 | 
         tweetLC.indexOf('ffb') > -1 |
         tweetLC.indexOf(' fb') > -1 |
         ( tweetLC.indexOf('follow') > -1 && tweetLC.indexOf('back') > -1 ) 
       ) {
   
        console.log("Tweet Applies: ", tweetLC);

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];   
        const reply = {
            status: `@${tweet.user.screen_name} ${randomResponse.text}`,
            in_reply_to_status_id: tweet.id_str,
            media_ids: [randomResponse.image_id]
        };

        T.post('statuses/update', reply, function(err, data, response) {
            if ( err ) {
                console.log(err);
            } else {
                console.log("Reply Sent: ", data.text);
            } 
        });

    }
});
