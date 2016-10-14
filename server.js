var express = require('express');
var app = express();
var qs = require('querystring');
var request = require('request');
var https = require('https');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var privateKey  = fs.readFileSync('./https_certificates/key.pem', 'utf8');
var certificate = fs.readFileSync('./https_certificates/server.crt', 'utf8');
var secrets = require('./secretInfo.js');
var credentials = {
  key: privateKey,
  cert: certificate
};
var mongoose = require('mongoose');
mongoose.Promise = global.Promise
var db = mongoose.connection;


db.on('error', console.error);
db.once('open', function() {
  console.log('connected to database');
  var httpsServer = https.createServer(credentials, app);
  httpsServer.listen(3000); 
});


mongoose.connect('mongodb://yandri:iloveyou@ds031862.mlab.com:31862/easy-raidfinder');


var userSchema = new mongoose.Schema({
  battleTag: String,
  accNumber: String
});

var realmSchema = new mongoose.Schema({
  realmName: String,
  posts: { type: Array, "default": []}
});



app.use(express.static(path.join(__dirname, '/client')));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/callback', function(req, response) {

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

  request(tokenUri + token_params, function(error, res, body){
    var body = JSON.parse(body);

    if (body.hasOwnProperty('access_token')) {

      var token = body['access_token'];
      var userApi = 'https://us.api.battle.net/account/user'

      request(userApi + "?access_token=" + token, function(err, res, body) {
        var body = JSON.parse(body);
        var battleTag = body.battletag.split('#')[0];
        var accNumber = body.id;
        var Users = mongoose.model('users', userSchema);
        var thisUser = new Users({battleTag: battleTag, accNumber: accNumber});

        response.send({accessToken: token, battleTag: battleTag});

        Users.findOne({accNumber: accNumber}, function(err, user) {
          if (err) {
            console.log(err);
          } else {
            if (user) {
              console.log('User Exits');
            } else {
              thisUser.save((err, result) => {
              if (err) return console.log(err);
                console.log('saved User to database')
              });
            }
          }
        });
      });
    } else {
      response.send('error'); 
    }
  });

})

app.get('/realmData/:realm', function(req, res) {
  var realm = req.params.realm;
  console.log(realm);

  var Realms = mongoose.model('realms', realmSchema);
  var thisRealm = new Realms({realmName: realm});

  Realms.findOne({ realmName: realm}, function(err, realm) {
    if (err) {
      console.log(err);
    } else {
      if (realm) {
        console.log('Realm Exits');
      } else {
        thisRealm.save((err, result) => {
        if (err) return console.log(err);
          console.log('saved Realm to database')
        });
      }
    }
  });
});





