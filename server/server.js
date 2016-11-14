

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var router = require('./api/routes');
var getToken = require('./oauth/getToken');
var fs = require('fs');

//HTTPS is required for blizzard secret token request to work
//in order to access player api data
var https = require('https');
var privateKey = fs.readFileSync('./server/https_certificates/key.pem', 'utf8');
var certificate = fs.readFileSync('./server/https_certificates/server.crt', 'utf8');
var credentials = {
  key: privateKey,
  cert: certificate
};

//create the express app
var app = express();
require('./database');
var token = require('./oauth/getToken');
console.log(token);
var isProduction = process.env.NODE_ENV === 'production';
var port = isProduction ? process.env.PORT : 3000;

app.use('/', express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api', router);
var qs = require('querystring'),
    request = require('request'),
    User = require('./models/User');

//this is my blizzard app info
//wont be added to github...
var secrets = require('./oauth/secretInfo');


app.post('/callback', (req, respond) => {
  getUserToken();
  //this function requets the unique user Token.
function getUserToken() {
  var code = req.body.code,
      redirectUri = "https://localhost:3000",
      scope = "wow.profile",
      key = secrets.client_id,
      secret = secrets.secret,
      grantType = "authorization_code",
      tokenUri = "https://us.battle.net/oauth/token?";

  //this will be the query string needed to
  //request the toekn successfully.
  var token_params = qs.stringify({
    client_id: key,
    client_secret: secret,
    code: code,
    scope: scope,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri
  });

  //make the request to the token url.
  return request(tokenUri + token_params, (err, res, body) => {

    if (err) {
      return console.log(err);
    }

    var body = JSON.parse(body);

    //if we get the unique token
    if (body.hasOwnProperty('access_token')) {
      var token = body['access_token']

      return requestAccount(token);
    }
  });
};

function requestAccount(token) {
  var userApi = 'https://us.api.battle.net/account/user';

  //request the users unique account id from blizzard.
  return request(userApi + "?access_token=" + token, function(err, res, body) {

    if (err) {
      return console.log(err);
    }

    var body = JSON.parse(body),
        battleTag = body.battletag.split('#')[0],
        account = body.id,
        thisUser = new User({battleTag: battleTag, account: account});

    //add the user account to the database.
    addUserToDatabase(thisUser);

    //send the token and the account battletag back to the client
    respond.status(200).json({accessToken: token, battleTag: battleTag});
  });
}

function addUserToDatabase(thisUser) {

  User.findOne({account: thisUser.account}, (err, user) => {
    if (err) {
      return console.log(err);
    }
    
    //if the user is not in the database add it.
    if (!user) {
      thisUser.save((err, result) => {
        if (err) return console.log(err);
        console.log('Saved User to database.')
      });
    }
  });
}
});


var httpsServer = https.createServer(credentials, app);
httpsServer.listen(port, function() {
  console.log('The server is running on port ' + port + '!.');
});


// We only want to run the workflow when not in production
if (!isProduction) {
  
  // We require the bundler inside the if block because
  // it is only needed in a development environment.
  var bundle = require('./proxyConfig/bundle.js');
  bundle();



  // Any requests to localhost:3000/build is proxied
  // to webpack-dev-server
  app.all('/build/*', function (req, res) {
    proxy.web(req, res, {
        target: 'http://localhost:8080'
    });
  });

}


var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({
  changeOrigin: true 
});

// It is important to catch any errors from the proxy or the
// server will crash. An example of this is connecting to the
// server when webpack is bundling
proxy.on('error', function(e) {
  console.log('Could not connect to proxy, please try again...');
});