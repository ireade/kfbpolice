const express = require('express');
const path = require('path');
const fs = require("fs");

const responses_helper = require("./modules/responses_helper");
const T = require('./modules/T');
const usernames = require('./modules/usernames');

const app = express();

app.set('port', (process.env.PORT || 5000));
app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname + '/views/index.html'));
}).listen(app.get('port'), function () {
    console.log('App is running, server is listening on port ', app.get('port'));
});


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

        const randomResponse = responses_helper.get_response();

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
