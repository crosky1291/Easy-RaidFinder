'use strict';

function HomeDirective () {
  return {
    template: require('../../../public/templates/home.html'),
    replace: true,
    controller: 'homeCtrl'
  }
}

module.exports = HomeDirective;