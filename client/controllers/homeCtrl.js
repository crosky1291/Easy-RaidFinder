'use strict';

angular.module('easyRaidFinder')
.controller('homeCtrl', function($scope, dataService, $http, $location) {

  var qs = $location.absUrl();
  if (qs.indexOf('code') !== -1) {
    $location.path( "/callback" );
  } else {
    console.log("it dosent have code");
  }

  
  $scope.login = function() {
    var key = "p8cv56sm2p929sr6enw2wgmfyh6mrtd9";
    var oAuthUrl = "https://www.us.battle.net/oauth/authorize?";
    var redirectUri = "https://localhost:3000";
    var scope = "wow.profile";
    var url = "https://us.battle.net/oauth/authorize?client_id=" + key + "&scope=" + scope + "&redirect_uri=" + redirectUri + "&response_type=code";
    
    window.location.href = url;
  }


  $scope.getCharacters = function() {
    var code = JSON.parse(localStorage.getItem('code'));
    var dataUri = "https://us.api.battle.net/wow/character/Cho'gall/Animator?locale=en_US&apikey=ew7sw57ke7f3rygybsy2vtdq8gz6cpmb"
    var token1 = 'u2kftbwuuqp54nkwane64zuk';
    
     $http.get(dataUri).then(function(response) {
       console.log(response);
     });
  }
  
  
})
.controller('secureController', function($scope, $http) {

    var code = (document.URL).split('=')[1];
    code = code.split("&")[0];
    
    
    $http.post('/callback', {code: code}).then(function(response) {
      console.log(response);
      if (response === "0") {
        console.log("this works!");
      }  
    });



})