'use strict'

var angular = require('angular')
var app = angular.module('easyRaidFinder', [require('angular-route')]);
app.config(configFunction);

//configuration of routes.
function configFunction($routeProvider, $locationProvider) {

  $routeProvider
    .when('/', {
      template: require('../public/templates/home.html'),
      controller: 'homeCtrl'
    })
    .when('/callback', {
      template: require('../public/templates/secure.html'),
      controller: 'verificationCtrl'
    })
    .when('/profile', {
      template: require('../public/templates/profile.html'),
      controller: 'mainCtrl'
    });
}

//this automatically requires the index.js file inside these folders.
//thats how everything is linked and readable.
require('./scripts/services');
require('./scripts/directives');
require('./scripts/controllers');
