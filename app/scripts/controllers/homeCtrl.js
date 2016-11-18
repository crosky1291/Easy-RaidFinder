'use strict';

function HomeCtrl ($scope, dataService, $http, $location) {

  var qs = $location.absUrl();
  if (qs.indexOf('code') !== -1) {
    $location.path( "/callback" ).replace();
  } else {
    console.log("it dosent have code");
  }
  
  $scope.login = function() {
   
    if (localStorage.getItem("access_token") === null) {
      var key = "p8cv56sm2p929sr6enw2wgmfyh6mrtd9";
      var oAuthUrl = "https://us.battle.net/oauth/authorize?";
      var redirectUri = "https://localhost:3000";
      var scope = "wow.profile";
      var url =  oAuthUrl + "client_id=" + key + "&scope=" + scope + "&redirect_uri=" + redirectUri + "&response_type=code";
      
      window.location.href = url;
    } else {
      $location.path('/profile');
    }
  }
};

module.exports = HomeCtrl;