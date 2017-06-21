const express = require('express');
const app = express();
const path = require('path');
app.set('port', (process.env.PORT || 5000));
app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname + '/views/index.html'));
}).listen(app.get('port'), function () {
    console.log('App is running, server is listening on port ', app.get('port'));
});

const T = require('./modules/T.secrets') || require('./modules/T');
const fs = require("fs");


/* ******************

 Upload Media

 ******************* */

const b64content = fs.readFileSync('images/annoyed_child.png', { encoding: 'base64' })

T.post('media/upload', { media_data: b64content }, function (err, data, response) {
  console.log(data);
})
