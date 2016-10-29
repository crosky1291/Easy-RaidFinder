'use strict';

angular.module('easyRaidFinder')
.controller('userCtrl', function($scope, $http, $location) {

  var accessToken = localStorage.getItem("access_token");

  if (accessToken === null) {
    $location.path('/');
  }

  $scope.timeRange = function(low, max, time) {
    var output = [];

    while (low <= max) {
      if (time === 'hours') {
        output.push(low);
      } else {
        if (low < 10) {
          output.push("0" + low);
        } else {
          output.push(low);
        }
      }

      low++;
    }
    return output;
  }

  $scope.getRealmSize = function() {

    var realm = $scope.realmsInfo.currentRealm;
    console.log($scope.realmsInfo.realmsData[realm].length);
    return $scope.realmsInfo.realmsData[realm].length;
  }

  

  $scope.getCharacters = function(){
    var charactersApi = 'https://us.api.battle.net/wow/user/characters';

    $http.get(charactersApi + "?access_token=" + accessToken)
    .then(function(res) {
      $scope.processCharacters(res.data.characters);
    });
  }();

  $scope.user = localStorage.getItem("battleTag");
  $scope.pickRealm = true;
  $scope.noPostsFound = false;
  $scope.makeRaid = false;

  $scope.realmsInfo = {
    currentRealm: "",
    realmsData: ""
  };

  $scope.raidPost = {
    name: "",
    date: "",
    hour: "",
    minute: "",
    amPm: "",
    faction: "",
    role: "",
    character: ""
  };


  $scope.selectedCharacter;
  $scope.emptyField = false;
  $scope.completeTimeFormat = false;

  $scope.currentCharacter = function() {
    $scope.realmsInfo.realmsData[$scope.realmsInfo.currentRealm].forEach(function(char) {

      if (char.name === $scope.selectedCharacter) {
        return $scope.raidPost.character = char;
      }
    });
  }


  $scope.verifyTimeFormat = function() {
    if (!$scope.raidPost.hour || !$scope.raidPost.minute || !$scope.raidPost.amPm) {
        $scope.completeTimeFormat = false;
    } else {
        $scope.completeTimeFormat = true;
    }
  }



  $scope.verifyForm = function() {
    var missing = [];
    
    for (var prop in $scope.raidPost) {
      if ($scope.raidPost[prop] === "") {
        missing.push(prop);
        $scope.emptyField = true;
      }
    }
    
    if (missing.length === 0) {
      console.log('calling it');
      return createRaid();
    }

    $scope.verifyTimeFormat();

  }


  $scope.verifyForm2 = function() {
    var missing = [];
    
    $scope.raidToJoin.character = $scope.raidPost.character;
    $scope.raidToJoin.realm = $scope.realmsInfo.currentRealm;

    for (var prop in $scope.raidToJoin) {
      if ($scope.raidToJoin[prop] === "") {
        missing.push(prop);
        $scope.emptyField = true;
      }
    }
    console.log(missing)
    if (missing.length === 0) {
      console.log('joining');
      return joinRaid();
    }

  }

  function joinRaid() {
    $http.post('/joinRaid', $scope.raidToJoin);
  }

  $scope.nextSevenDays = function() {
    var days = ['Today', ];
    var oneDay = 86400000;
    var nextDay = Date.now() + oneDay;


    for (var i = 0; i < 6; i++) {
      var parsed = new Date(nextDay);
      var year = parsed.getFullYear().toString();

      parsed = parsed.toString();
      var date = parsed.split(year)[0] + year;

      days.push(date);
      nextDay = nextDay + oneDay;
    }

    return days;
  }


  function createRaid() {
    $scope.raidPost.realm = $scope.realmsInfo.currentRealm

    $http.post("/createRaid", $scope.raidPost);
  }

  $scope.processCharacters = function(chars) {
    console.log('hi');
    var realms = {};
    var classes = {0: 'none', 1: 'Warrior', 2: 'Paladin', 3: 'Hunter', 4: 'Rogue', 5: 'Priest',
                   6:'Death Knight', 7:'Shaman', 8:'Mage', 9:'Warlock', 10:'Monk', 11:'Druid', 12:'Demon Hunter'};

    var races = {1: 'Human', 2: 'Orc', 3: 'Dwarf', 4: 'Night Elf', 5: 'Undead', 6: 'Tauren', 7: 'Gnome', 8: 'Troll',
                 9: 'Goblin', 10: 'Blood Elf', 11: 'Draenei', 22: 'Worgen', 24: 'Panda', 25: 'Panda', 26: 'Panda'  };
    var genders = {0: 'Male', 1: 'Female'};

    chars.forEach(function(char) {
      var charRealm = char.realm;

      var classPath = classes[char.class].split(" ").join("").toLowerCase();
      var imgPath = '../images/class_photos/' + classPath + '.png';

      var charInfo = {
        name: char.name,
        level: char.level,
        class: classes[char.class],
        classImg: imgPath,
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


  function displayPosts() {

  }
  $scope.raidsFound = false;
  $scope.posts;
  $scope.getRealmData = function(realm) {
    $http.get( '/posts/' + realm)
    .then(function(req, res) {
  
      if (req.data === "no posts found") {
        $scope.noPostsFound = true;
      } else {
        $scope.raidsFound = true;
        $scope.posts = req.data;
        console.log(req.data)
      }
    });
  }

  $scope.raidToJoin = {
    id: "",
    character: "",
    role: "",
    name: "",
    realm: ""
  }

  $scope.joinRaid = function(event) {
    $scope.emptyField = false;
    $scope.raidToJoin.id = event.target.getAttribute('dbId');
    $scope.raidToJoin.name = event.target.getAttribute('rName');
  }


});








