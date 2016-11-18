'use strict'

var angular = require('angular')
var app = angular.module('easyRaidFinder', [require('angular-route')]);
app.config(configFunction);

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

require('./scripts/services');
require('./scripts/directives');
require('./scripts/controllers');
