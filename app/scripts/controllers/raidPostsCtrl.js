'use strict';

function RaidPostsCtrl ($scope, raidPostsService) {

  $scope.getRealmData = function(realm) {
    raidPostsService.getRaidPosts(realm, function(response) {

      // if (req.status === 204) {
      //   $scope.changeDisplay('noPostsFound');
      // } else {
      $scope.posts = response.data;
      //$scope.changeDisplay('postsFound');
      // }
    });

  }

};

module.exports = RaidPostsCtrl;