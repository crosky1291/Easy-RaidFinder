'use strict'

angular.module('easyRaidFinder')
.service('dataService', function($http) {
  
  this.authenticate = function(callback) {
    var key = "gvyz3zhzr9u6ck4fejksf8wbrtt84jzh";
    var secret = "xwn7DrVtPD5zc984bKDaNPuDqnYAB3z5";
    var oAuthUrl =   "https://us.battle.net/oauth/authorize?";
    var redirectUri = "http://localhost:3000/#/"

    window.location.href = oAuthUrl + "response_type=token&client_id=" + key + "&redirect_uri=" + redirectUri

    // $http.get( oAuthUrl + "response_type=token&client_id=" + key + "&redirect_uri=" + redirectUri )
    // .then(callback) 
  }
  
});