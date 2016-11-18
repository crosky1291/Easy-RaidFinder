'use strict'

function raidPostsService ($http) {
  //get the raidposts from api
  this.getRaidPosts = function(realm, callback) { 
    $http.get( 'api/posts/' + realm)
    .then(callback);
  };
  //adds a character to a raid post
  this.joinRaidPost = function(realm, postId, character, callback) {
    $http.put('/api/' + realm + "/" + postId, character)
    .then(callback);
  }
  //creates a new raid post
  this.createRaidPost = function(realm, raidPost, callback) {
    $http.post("/api/posts/" + realm, raidPost)
    .then(callback);
  }
};

module.exports = raidPostsService;