'use strict';

function GetStartedDirective () {
  return {
    restrict: "EA",
    template: require('../../../public/templates/getStarted.html'),
    replace: true,
    scope: false
  }
}

module.exports = GetStartedDirective;