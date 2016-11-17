'use strict';

function NoPostsFoundDirective () {
  return {
    restrict: "EA",
    template: require('../../../public/templates/noPostsFound.html'),
    replace: true,
    scope: false
  }
}

module.exports = NoPostsFoundDirective;