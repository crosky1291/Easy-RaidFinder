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

var postSchema = new mongoose.Schema({
  realm: String,
  raidName: String,
  raidDate: String,
  raidTime: String,
  raidFaction: String,
  whosGoing: { type: Array, "default": []}
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
      var userApi = 'https://us.api.battle.net/account/user';

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

app.get('/posts/:realm', function(req, res) {
  var realm = req.params.realm;

  var Posts = mongoose.model('Posts', postSchema);

  Posts.find({ realm: realm}, function(err, posts) {
    console.log(posts)
    if (err) {
      console.log(err);
    }
    //if no posts
    if (!posts.length) {
       res.send('no posts found');
      //otherwise send the posts
    } else {
    //send the posts
     return res.send(posts);
    }
  });
});

app.post('/createRaid', function(req, res) {
  var data = req.body;

  var Post = mongoose.model('Posts', postSchema)
  var newPost = new Post({
    realm: data.realm,
    raidName: data.name,
    raidDate: data.date,
    raidTime: data.hour + ":" + data.minute + " " + data.amPm,
    raidFaction: data.faction,
  });


    data.character.role = data.role;

    var thisChar = data.character;

    newPost.whosGoing.push(thisChar);
    newPost.save();
});

app.post('/joinRaid', function(req, res) {
  var data = req.body;
  var postId = data.id;
  var realm = data.realm;
  var thisChar = data.character;
  thisChar.role = data.role;

  var Posts = mongoose.model('Posts');

    //var post = realm.posts._id(postId)
  Posts.findById(postId, function(err, post)  {
    post.whosGoing.push(thisChar);
    post.save();
  })
})





