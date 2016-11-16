'use strict'

function raidPostsService ($http) {

  this.getRaidPosts = function(realm, callback) { 
    $http.get( 'api/posts/' + realm)
    .then(callback);
  };
};

module.exports = raidPostsService;