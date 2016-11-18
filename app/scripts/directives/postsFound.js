'use strict';

function PostsFoundDirective () {
  return {
    template: require('../../../public/templates/postsFound.html'),
    replace: true,
    scope: false,
  }
}

module.exports = PostsFoundDirective;