'use strict';

function HomeCtrl ($scope, dataService, $http, $location) {

  //check if the url has the code from blizzard
  //if so send them to /callback for verification and to request an access_token.
  var qs = $location.absUrl();
  if (qs.indexOf('code') !== -1) {
    $location.path( "/callback" ).replace();
  } else {
    console.log("it dosent have code");
  }
  
  //check if theres already a valid access token stored
  //if not redirect the user and have them login at blizzard so we can have back another key
  //and we can request a new token.
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