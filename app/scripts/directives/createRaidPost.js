'use strict';

function CreateRaidPostDirective () {
  return {
    restrict: "EA",
    template: require('../../../public/templates/joinRaid.html'),
    replace: true,
    scope: false
  }
}

module.exports = CreateRaidPostDirective;