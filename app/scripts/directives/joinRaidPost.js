'use strict';

function JoinRaidPostDirective () {
  return {
    restrict: "EA",
    template: require('../../../public/templates/joinRaidPost.html'),
    replace: true,
    scope: false
  }
}

module.exports = JoinRaidPostDirective;