'use strict';

function userCtrl ($scope, $http, $location) {

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


  
  $scope.pickRealm = true;
  $scope.noPostsFound = false;
  $scope.makeRaid = false;


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

  $scope.postToJoin = {};
  $scope.selectedCharacter;
  $scope.emptyField = false;
  $scope.completeTimeFormat = false;




  $scope.verifyTimeFormat = function() {
    if (!$scope.raidPost.hour || !$scope.raidPost.minute || !$scope.raidPost.amPm) {
        $scope.completeTimeFormat = false;
    } else {
        $scope.completeTimeFormat = true;
    }
  }


  $scope.showWhosGoing = false;
  $scope.showWhosGoingFunc = function(event) {
    $scope.showWhosGoing = true;
    var post = event.target.getAttribute('post');
    $scope.postToJoin = JSON.parse(post);
  }
  $scope.verifyForm = function(form) {
    var missing = [];
    
    var form = form === 'joinRaid' ? $scope.joinRaidForm : $scope.createRaidForm
    for (var prop in $scope.raidPost) {
      if ($scope.raidPost[prop] === "") {
        missing.push(prop);
        $scope.emptyField = true;
      }
    }
    
    if (missing.length === 0) {
      $scope.selectedCharacter = "";
      return createRaid($scope.realmsInfo.currentRealm);
    }

    $scope.verifyTimeFormat();

  }

  function joinRaid() {
    var postId = $scope.raidToJoin.id;
    var realm = $scope.raidToJoin.realm;
    $http.put('/api/' + realm + "/" + postId , $scope.raidToJoin)
    .then(function(req, res) {
      $scope.getRealmData($scope.realmsInfo.currentRealm);
    });
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


  function createRaid(realm) {
    $scope.raidPost.realm = $scope.realmsInfo.currentRealm
  
    $http.post("/api/posts/" + realm, $scope.raidPost)
    .then(function(req, res) {
      $scope.getRealmData($scope.realmsInfo.currentRealm);

      //reset the create-character data
      for (var i in $scope.raidPost) {
        $scope.raidPost[i] = "";
      }
    });
  }

  



  $scope.raidsFound = false;
  $scope.posts;

  $scope.display = {
    loadingPage: true,
    noPostsFound: false,
    postsFound: false,
    makeRaid: false,
    joinRaid: false,
  }

  $scope.changeDisplay = function(display) {

    for (var prop in $scope.display) {
      prop === display ? $scope.display[prop] = true : $scope.display[prop] = false;
    }
    console.log($scope.display);
  }

}

//module.exports = userCtrl;








