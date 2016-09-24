'use strict';

angular.module('easyRaidFinder')
.controller('homeCtrl', function($scope, dataService, $http) {
  
  $scope.login = function() {
    var key = "ew7sw57ke7f3rygybsy2vtdq8gz6cpmb";
    var secret = "xwn7DrVtPD5zc984bKDaNPuDqnYAB3z5";
    var oAuthUrl = "https://www.us.battle.net/oauth/authorize?";
    var redirectUri = "https://localhost:3000/oauth_callback.html";
    var scope = "wow.profile";
    var state = "12345";
    var url = "https://us.battle.net/oauth/authorize?client_id=" + key + "&scope=" + scope + "&state=" + state + "&redirect_uri=" + redirectUri + "&response_type=code";



    
    window.location.href = url;
    //oAuthUrl + "response_type=token&client_id=" + key + "&grant_type=authorization" + "&redirect_uri=" + redirectUri;

  }


  $scope.getCharacters = function() {
    var code = JSON.parse(localStorage.getItem('code'));
    var dataUri = "https://us.api.battle.net/wow/character/Cho'gall/Animator?locale=en_US&apikey=ew7sw57ke7f3rygybsy2vtdq8gz6cpmb"
    var token1 = 'u2kftbwuuqp54nkwane64zuk';
    var token2 = 'dju7hzm7pgkp5ddu466macfj';
    
     $http.get(dataUri).then(function(response) {
       console.log(response);
     });
  }

  
  
})
.controller('secureController', function($scope, $http) {

  $scope.getToken = function() {
      var code = (document.URL).split('=')[1];
      code = code.split("&")[0];
      // var redirectUri = "https://localhost:3000/oauth_callback.html";
      // var scope = "wow.profile";

      // var key = "ew7sw57ke7f3rygybsy2vtdq8gz6cpmb";
      // var secret = "xwn7DrVtPD5zc984bKDaNPuDqnYAB3z5";

      // var grantType = "authorization_code";
      // var tokenUri = "https://us.battle.net/oauth/token";
      // var URI = tokenUri + "?client_id=" + key + "&client_secret=" + secret + "&grant_type=authorization_code&code=" + code + "&redirect_uri=" + redirectUri;

      
    
    $http.post('/', {code: code}).then(function(response) {
       
     });

  }



})