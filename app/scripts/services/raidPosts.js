'use strict'

function raidPostsService ($http) {

  this.getRaidPosts = function(realm, callback) { 
    $http.get( 'api/posts/' + realm)
    .then(callback);
  };

  this.joinRaidPost = function(realm, postId, character, callback) {
    $http.put('/api/' + realm + "/" + postId, character)
    .then(callback);
  }

  this.createRaidPost = function(realm, raidPost, callback) {
    $http.post("/api/posts/" + realm, raidPost)
    .then(callback);
  }
};

module.exports = raidPostsService;