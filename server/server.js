'use strict'

var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    router = require('./api/routes'),
    oauth = require('./oauth/getToken'),
    token = require('./oauth/getToken'),
//HTTPS is required for blizzard secret token request to work
//in order to access player api data
    https = require('https'),
    privateKey = fs.readFileSync('./server/https_certificates/key.pem', 'utf8'),
    certificate = fs.readFileSync('./server/https_certificates/server.crt', 'utf8'),
    credentials = {
      key: privateKey,
      cert: certificate
    },

//create the express app
    app = express();

    //the database will start immediately after this line of code.
    require('./database');


var isProduction = process.env.NODE_ENV === 'production';
var port = isProduction ? process.env.PORT : 3000;

app.use('/', express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api', router);


app.post('/callback', (req, res) => {
  var code = req.body.code;

  //Try to get the unique access Token from blizzards token api
  oauth.getUserToken(code, (tokenResponse) => {
    if (tokenResponse.accessToken !== undefined) {
      //send the token to the client
      res.status(200).json(tokenResponse);
    }
  });
});

//create the https server
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(port, function() {
  console.log('The server is running on port ' + port + '!.');
});


// We only want to run the workflow in development
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

//proxy server communication from the webpack-dev-server to the actual https express server.
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