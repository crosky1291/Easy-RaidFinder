'use strict';

var angular = require('angular');

angular.module('easyRaidFinder').service('dataService', require('./data'));
angular.module('easyRaidFinder').service('raidPostsService', require('./raidPosts'));