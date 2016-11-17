'use strict'

function MainCtrl($scope, dataService, raidPostsService) {

  //call right away to the blizzard api to receive the players
  //character data.
  dataService.getCharacterData(function(response) {
    $scope.realmsData = response;
  });


  $scope.selectedRealm = "";
  $scope.user = localStorage.getItem("battleTag");




  $scope.raidToJoin = {
    id: "",
    name: "",
    character: "",
    role: ""
  }

  $scope.selectedCharacter = "";

  $scope.updateCharacter = function(action) {
  console.log('hi')
  var characters = $scope.realmsData[$scope.selectedRealm];
  
  characters.forEach(function(char) {
    if (char.name === $scope.selectedCharacter) {
      if (action === 'joinRaid') {
        return $scope.raidToJoin.character = char; 
      } else if (action === 'createRaid') {
        return $scope.createRaid.character = char; 
      }
    }
  });
}

  $scope.verifyForm = function(form) {
    var missingFields = [];
    
    var formObj = form === 'joinRaid' ? $scope.raidToJoin : $scope.raidToCreate;

    for (var prop in formObj) {
      if (formObj[prop] === "") {
        missingFields.push(prop);
      }
    }

    if (missingFields.length === 0 && form === 'joinRaid') {
      return $scope.joinRaidPost();
    } else if (missingFields.length === 0 && form === 'createRaid') {
      return $scope.createRaidPost();
    }

  }

  $scope.joinRaidPost = function() {
    var info = $scope.raidToJoin;
    var realm = $scope.selectedRealm;
    var postId = info.id;
    var character = info.character;

    //add the role to the character obj
    character.role = info.role;

    //call the service to store the data;
    raidPostsService.joinRaidPost(realm, postId, character, function(response) {

      //if it saved to database correctly get the updated data again.
      if (response.status === 200) $scope.getRealmData($scope.selectedRealm);
      else console.log('Try again');
    });
  }

  //create raid stuff...
  $scope.raidToCreate = {
    name: "",
    date: "",
    hour: "",
    minute: "",
    amPm: "",
    faction: "",
    role: "",
    character: ""
  };


  $scope.reset = function(obj) {
    for(var prop in obj) {
      obj[prop] = "";
    }

    return obj;
  }

  $scope.getRealmData = function(realm) {
    raidPostsService.getRaidPosts(realm, function(res) {
      console.log(res);
      if (res.status === 204) return $scope.changeDisplay('no posts found');
    
      $scope.posts = res.data;
      $scope.changeDisplay('posts found');
    });
  }


  $scope.changeDisplay = function(display) {
    $scope.whatToDisplay = display;
  }

  $scope.whatToDisplay = "get started";

  $scope.joinRaid = function(event) {
    //change the display container
    $scope.changeDisplay('join raid post');
  
    //$scope.selectedCharacter = "";
    // $scope.raidPost.character = "";
    var post = JSON.parse(event.target.getAttribute('post'));
     $scope.raidToJoin.id = post._id
     $scope.raidToJoin.name = post.raidName;
  }
}

module.exports = MainCtrl;