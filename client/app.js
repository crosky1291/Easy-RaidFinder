var app = angular.module('easyRaidFinder', ['ngRoute']);

app.config(configFunction);

function configFunction($routeProvider, $locationProvider) {

  $routeProvider
    .when('/', {
      templateUrl: './partials/home.html',
      controller: 'homeCtrl'
    })
    .when('/profile', {
      templateUrl: './partials/home.html',
      controller: 'homeCtrl'
    });
}
