/**
 * AboutController goes here
 */

angular
  .module('Codesmith.profileController', ['ngRoute'])
  .controller('profileController', profileController);

function profileController($scope, $http) {
  $scope.accessToken = JSON.parse(window.localStorage.getItem("imgur")).oauth.access_token;
}



