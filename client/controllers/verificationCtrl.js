'use strict';

angular.module('easyRaidFinder')
.controller('verificationCtrl', function($scope, $http, $location) {
  var url = window.location.href;
  var code = url.split('=')[1].split('#')[0];
  console.log(code);
  $http.post('/callback', {code: code});
});
