'use strict'

function MainCtrl($scope, dataService) {

$scope.getCharacters = function(){
    var charactersApi = 'https://us.api.battle.net/wow/user/characters';

    $http.get(charactersApi + "?access_token=" + accessToken)
    .then(function(res) {
      $scope.processCharacters(res.data.characters);
    });
  }();
}