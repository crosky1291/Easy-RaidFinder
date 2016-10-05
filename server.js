var express = require('express');
var app = express();
var qs = require('querystring');
var request = require('request');
var https = require('https');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var privateKey  = fs.readFileSync('./https_certificates/key.pem', 'utf8');
var certificate = fs.readFileSync('./https_certificates/server.crt', 'utf8');
var secrets = require('./secretInfo.js');
var credentials = {
  key: privateKey,
  cert: certificate
};


app.use(express.static(path.join(__dirname, '/client')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/callback', function(req, res) {

  var code = req.body.code;
  var redirectUri = "https://localhost:3000";
  var scope = "wow.profile";
  var key = secrets.client_id;
  var secret = secrets.secret;
  var grantType = "authorization_code";
  var tokenUri = "https://us.battle.net/oauth/token?";
  var token_params = qs.stringify({
    client_id: key,
    client_secret: secret,
    code: code,
    scope: scope,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri
  });

  request(tokenUri + token_params, function(error, response, body){
    if (error) {
      console.log(error);
    } else {
      console.log(body);
    }
  });

 })


var httpsServer = https.createServer(credentials, app);
httpsServer.listen(3000);


