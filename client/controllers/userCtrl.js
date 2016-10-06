'use strict';

angular.module('easyRaidFinder')
.controller('userCtrl', function($scope, $http, $location) {

  var accessToken = localStorage.getItem("access_token");

  if (accessToken === null) {
    $location.path('/');
  }

  var charactersApi = 'https://us.api.battle.net/wow/user/characters'

  $http.get(charactersApi + "?access_token=" + accessToken).then(function(res) {
    $scope.processCharacters(res.data.characters);
  })

  $scope.realmsInfo = {
    currentRealm: "",
    realmsData: ""
  };


  $scope.processCharacters = function(chars) {

    var realms = {};
    var classes = {0: 'none', 1: 'Warrior', 2: 'Paladin', 3: 'Hunter', 4: 'Rogue', 5: 'Priest',
                   6:'Death Knight', 7:'Shaman', 8:'Mage', 9:'Warlock', 10:'Monk', 11:'Druid', 12:'Demon Hunter'};

    var races = {1: 'Human', 2: 'Orc', 3: 'Dwarf', 4: 'Night Elf', 5: 'Undead', 6: 'Tauren', 7: 'Gnome', 8: 'Troll',
                 9: 'Goblin', 10: 'Blood Elf', 11: 'Draenei', 22: 'Worgen', 24: 'Panda', 25: 'Panda', 26: 'Panda'  };
    var genders = {0: 'Male', 1: 'Female'};

    chars.forEach(function(char) {
      var charRealm = char.realm;

      var charInfo = {
        name: char.name,
        level: char.level,
        class: classes[char.class],
        race: races[char.race],
        gender: genders[char.gender]
      }

      if (realms[charRealm] === undefined) {
        realms[charRealm] = [];
      }

      realms[charRealm].push(charInfo);
    })  

    $scope.realmsInfo.realmsData = realms;
  }

  $scope.log = function() {
    console.log($scope.realmInfo.selectedRealm);
  }


});








