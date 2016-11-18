'use strict';

function CreateRaidPostDirective () {
  return {
    restrict: "EA",
    template: require('../../../public/templates/createRaidPost.html'),
    replace: true,
    scope: false
  }
}

module.exports = CreateRaidPostDirective;