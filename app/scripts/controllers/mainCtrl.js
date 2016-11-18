'use strict'

function MainCtrl($scope, dataService, raidPostsService) {

  //call right away to the blizzard api to receive the players
  //character data.
  dataService.getCharacterData(function(res) {
    $scope.realmsData = res;
  });

  //retrive the user from local storage
  $scope.user = localStorage.getItem("battleTag");

  //stores the realm the user has selected
  //stores the charcater user selects when joining or creating a raid post.
  //changes the view depending on its value
  $scope.selectedRealm = "";
  $scope.selectedCharacter = "";
  $scope.whatToDisplay = "get started";

  //gets called to change the display
  $scope.changeDisplay = function(display) {
    $scope.whatToDisplay = display;
  }

  //gets raidposts information from the database
  $scope.getRealmData = function(realm) {
    raidPostsService.getRaidPosts(realm, function(res) {
  
      //reset the view input fields for joining a raid;
      //reset the view input fields for creating a raid;
      $scope.raidToJoin = $scope.reset($scope.raidToJoin);
      $scope.raidToCreate = $scope.reset($scope.raidToCreate);

      //if there is no raid posts
      if (res.status === 204) return $scope.changeDisplay('no posts found');
      //else display the posts
      $scope.posts = res.data;
      $scope.changeDisplay('posts found');
    });
  }

  
  //sets the characters proprties to the create or join form user is filling.
  $scope.updateCharacter = function(form) {
  var characters = $scope.realmsData[$scope.selectedRealm];
  
  //go through the characters in the selected realm and when you find the selected charcater
  //set it to the correct form (join or create)
  characters.forEach(function(char) {
    if (char.name === $scope.selectedCharacter) {
      if (form === 'joinRaidPost') return $scope.raidToJoin.character = char;
      else if (form === 'createRaidPost') return $scope.raidToCreate.character = char; 
    }
  });
}

  //used to verify form fields for join/create raid posts forms. 
  $scope.emptyFormField = false;
  $scope.completeTimeFormat = false;
  $scope.verifyForm = function(form) {
    var missingFields = [];
    var formObj = form === 'joinRaidPost' ? $scope.raidToJoin : $scope.raidToCreate;

    for (var prop in formObj) {
      if (formObj[prop] === "") missingFields.push(prop);
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

  //use to reset the value of form fields
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

  //////////////////////////// CREATE RAID POST DIRECTIVE //////////////////////////////////
  /////////////////////////////////// STARTS HERE //////////////////////////////////////////
  
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

  //makes sure an hour, minute and time is picked before displaying
  //the error span
  $scope.verifyTimeFormat = function() {
    var post = $scope.raidToCreate;
    
    //if these properties are filled then the time format is complete.
    if ( post.hour && post.minute && post.amPm ) {
      $scope.completeTimeFormat = true;
    }
  }

  //gets the next 7 days starting from today.
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

  //returns an array 1-12 for hours
  //and 0-59 for minutes
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

  //creates the raidPost ounce all fields pass the verified tests
  $scope.createRaidPost = function() {
    var raidPost = $scope.raidToCreate,
        realm = $scope.selectedRealm;
    
    raidPostsService.createRaidPost(realm, raidPost, function(res) {
      if (res.status === 200) {
        $scope.getRealmData($scope.selectedRealm);
      }
    });
  }

  //////////////////////////// CREATE RAID POST DIRECTIVE //////////////////////////////////
  /////////////////////////////////// ENDS HERE ////////////////////////////////////////////


  //////////////////////////// JOIN RAID POST DIRECTIVE //////////////////////////////////
  /////////////////////////////////// STARTS HERE ////////////////////////////////////////

  $scope.raidToJoin = {
    id: "",
    name: "",
    character: "",
    role: ""
  }

  //called add the character to the database for the raid post joined.
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
    });
  }

  //////////////////////////// JOIN RAID POST DIRECTIVE //////////////////////////////////
  ////////////////////////////////// ENDS HERE //////////////////////////////////////


  //////////////////////////// POSTS FOUND DIRECTIVE //////////////////////////////////
  ////////////////////////////////// STARTS HERE //////////////////////////////////////

  //being called to change the display and store 
  //the post id and name into the clicked raid post.
  $scope.joinRaid = function(event) {
    $scope.changeDisplay('join raid post');
  
    var post = JSON.parse(event.target.getAttribute('post'));
    $scope.raidToJoin.id = post._id
    $scope.raidToJoin.name = post.raidName;
  }

  //overlay that shows the characters that have joined a raid post
  $scope.showWhosGoing = false;
  $scope.showWhosGoingFunc = function(event) {
    $scope.showWhosGoing = true;
    var post = event.target.getAttribute('post');
    $scope.clickedPost = JSON.parse(post);
  }

  //////////////////////////// POSTS FOUND DIRECTIVE //////////////////////////////////
  ////////////////////////////////// ENDS HERE //////////////////////////////////////
}

module.exports = MainCtrl;