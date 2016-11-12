

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
var isProduction = process.env.NODE_ENV === 'production';
var port = isProduction ? process.env.PORT : 3000;

app.use('/', express.static('public'));
app.use('/api', router);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/callback', (req, res) => {
  console.log(getUserToken());
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