var Webpack = require('webpack');
var path = require('path');
var nodeModulesPath = path.join(__dirname, 'node_modules');
var buildPath = path.join(__dirname, 'public/build');
var mainPath = path.join(__dirname, 'app/app.js');


var config = {

  // We change to normal source mapping
  entry: mainPath,
  output: {
    path: buildPath,
    filename: 'app.bundle.js'
  },
  module: {
    loaders: [
    // babel-loader gives you
    // ES6/7 syntax and JSX transpiling out of the box
    {
      test: /\.js$/,
      loader: 'babel',
      exclude: [nodeModulesPath]
    },

    // without this loader angular dosent know how to handle 
    // .html files... this adds the html templates to the bundle
    { 
        test: /\.html$/,
        exclude: /node_modules/,
        loader: 'raw'
    }],
  },

  //add the libraries here.
  plugins: [
    new Webpack.optimize.CommonsChunkPlugin(/* chunkName= */"libraries", /* filename= */"libraries.bundle.js")
  ]
};

module.exports = config;