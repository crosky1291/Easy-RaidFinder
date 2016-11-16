'use strict'

function MainCtrl($scope, dataService) {

  //call right away to the blizzard api to receive the players
  //character data.
  dataService.getCharacterData(function(response) {
    $scope.realmsData = response;
  });

  $scope.changeDisplay = function(display) {
    $scope.whatToDisplay = display;
  }

  $scope.yandri = "yandri Sanchez"
  $scope.selectedRealm = "";
  $scope.whatToDisplay = "get started";
  $scope.user = localStorage.getItem("battleTag");
}

module.exports = MainCtrl;