'use strict';

function RaidPostsCtrl ($scope, raidPostsService) {

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
    console.log(display)
  }

  $scope.whatToDisplay = "get started";

};

module.exports = RaidPostsCtrl;