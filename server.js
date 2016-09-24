var express = require('express');
var app = express();
var qs = require('querystring');
var request = require('request');
var https = require('https');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var privateKey  = fs.readFileSync('./key.pem', 'utf8');
var certificate = fs.readFileSync('./server.crt', 'utf8');
var secrets = require('./secretInfo.js');
var credentials = {
  key: privateKey,
  cert: certificate
};

console.log(secrets);


app.use(express.static(path.join(__dirname, './client/')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

 app.post('/', function(req, res) {

      var code = req.body.code;
      var redirectUri = "https://localhost:3000/oauth_callback.html";
      var scope = "wow.profile";

      var key = secrets.client_id;
      var secret = secrets.secret;

      var grantType = "authorization_code";
      var tokenUri = "https://us.battle.net/oauth/token";
      var uriBody = "?client_id=" + key + "&client_secret=" + secret + "&grant_type=authorization_code&code=" + code + "&redirect_uri=" + redirectUri + "&scope=" + scope;
      console.log(code);

var token_params = qs.stringify({
      client_id: key,
      client_secret: secret,
      code: code,
      scope: scope,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri
    });

    request('https://us.battle.net/oauth/token?' + token_params, function(error, response, body){
      if (error) {
        console.log(error);
      } else {
        console.log(body) 
      }

    });


  
   //console.log(req.body) 
  
 }) //POST https://api.blah.com/oauth/token?grant_type=authorization_code&code=xxx&redirect_uri=xxx&client_id=xxx&client_secret=xxx

app.get('/oauth_callback.html', function(req, res) {
  console.log('hello!!!!!!!!!');
})

var httpsServer = https.createServer(credentials, app);
httpsServer.listen(3000);



// app.listen(3001, function() {
//    console.log('connected to port 3000')
//  });
