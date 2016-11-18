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

  $scope.updateCharacter = function(form) {
  var characters = $scope.realmsData[$scope.selectedRealm];
  
  characters.forEach(function(char) {
    if (char.name === $scope.selectedCharacter) {
      if (form === 'joinRaidPost') {
        return $scope.raidToJoin.character = char; 
      } else if (form === 'createRaidPost') {
        return $scope.raidToCreate.character = char; 
      }
    }
  });
}
  
  $scope.emptyFormField = false;
  $scope.completeTimeFormat = false;
  $scope.verifyForm = function(form) {
    var missingFields = [];
    
    var formObj = form === 'joinRaidPost' ? $scope.raidToJoin : $scope.raidToCreate;

    for (var prop in formObj) {
      if (formObj[prop] === "") {
        missingFields.push(prop);
      }
    }

    if (missingFields.length === 0 && form === 'joinRaidPost') {

      //reset the flag since user filled out all fields and proceed to join the raidpost.
      $scope.emptyFormField = false;
      return $scope.joinRaidPost();
    } else if (missingFields.length === 0 && form === 'createRaidPost') {

      //reset the flag since user filled out all fields and proceed to create the raidpost.
      $scope.emptyFormField = false;
      return $scope.createRaidPost();
    }

    //otherwise set the empty form field track flag to true to tell 
    //the user he needs to fill up the input fields;
    $scope.emptyFormField = true;
  }

  $scope.verifyTimeFormat = function() {
    var post = $scope.raidToCreate;
    
    //if these properties are filled then the time format is complete.
    if ( post.hour && post.minute && post.amPm ) {
      $scope.completeTimeFormat = true;
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
      if (response.status === 200) {
        $scope.getRealmData($scope.selectedRealm);
      }
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

  $scope.timeRange = function(time) {
    var low = time === "hours" ? 1 : 0;
    var max = time ==="hours" ? 12 : 59;
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

  $scope.createRaidPost = function() {
    var raidPost = $scope.raidToCreate,
        realm = $scope.selectedRealm;
    
    raidPostsService.createRaidPost(realm, raidPost, function(res) {
      if (res.status === 200) {
        $scope.getRealmData($scope.selectedRealm);
      }
    });
  }






  $scope.reset = function(obj) {

    //resets all the form fields
    for(var prop in obj) {
      obj[prop] = "";
    }

    //resets the character selected;
    //reset time format and
    //reset form fields
    $scope.selectedCharacter = "";
    $scope.emptyFormField = false;
    $scope.completeTimeFormat = false;

    return obj;
  }

  $scope.getRealmData = function(realm) {
    raidPostsService.getRaidPosts(realm, function(res) {
      
      //reset the view input fields for joining a raid;
      //reset the view input fields for creating a raid;
      $scope.raidToJoin = $scope.reset($scope.raidToJoin);
      $scope.raidToCreate = $scope.reset($scope.raidToCreate);

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
  
    var post = JSON.parse(event.target.getAttribute('post'));
     $scope.raidToJoin.id = post._id
     $scope.raidToJoin.name = post.raidName;
  }

  $scope.showWhosGoing = false;
  $scope.showWhosGoingFunc = function(event) {
    $scope.showWhosGoing = true;
    var post = event.target.getAttribute('post');
    $scope.clickedPost = JSON.parse(post);
  }
}

module.exports = MainCtrl;