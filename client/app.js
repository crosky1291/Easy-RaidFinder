var app = angular
    .module('myApp', [
        'ngRoute',
        'Codesmith.HomeController',
        'Codesmith.profileController',
    ]);

app.config(configFunction);

function configFunction($routeProvider, $locationProvider) {

    $routeProvider
        .when('/', {
            templateUrl: './partials/home.html',
            controller: 'HomeController'
        })
        .when('/profile', {
            url: '/profile',
            templateUrl: './partials/profile.html',
            controller: 'profileController'
        })
}
