var Webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('../../webpack.config.js');
var path = require('path');
var mainPath = path.join(__dirname, 'app/app.js');

module.exports = function () {

  // First we fire up Webpack and pass in the configuration
  var bundleStart = null;
  var compiler = Webpack(webpackConfig);

  // Give notice in the terminal when it starts bundling and
  // set the time it started
  compiler.plugin('compile', function() {
    console.log('Bundling...');
    bundleStart = Date.now();
  });

  // Also give notice when it is done compiling, including the
  // time it took.
  compiler.plugin('done', function() {
    console.log('Bundled in ' + (Date.now() - bundleStart) + 'ms!');
  });

  var bundler = new WebpackDevServer(compiler, {

    // We need to tell Webpack to serve our bundled application
    // from the build path. When proxying:
    // http://localhost:3000/build -> http://localhost:8080/build
    publicPath: '/build/',

    // Configure hot replacement
    hot: true,

    // stops the terminal from logging everything
    // that webpack is compiling
    noInfo: true
  });

  // Fire up the development server and give notice in the terminal
  // that we are starting the initial bundle
  bundler.listen(8080, function () {
    console.log('Bundling project, please wait...');
  });
};