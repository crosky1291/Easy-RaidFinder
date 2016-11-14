'use strict';

function RaidPostDirective () {
  return {
    template: require('../../../public/templates/raidPost.html'),
    replace: true
  }
}

module.exports = RaidPostDirective;