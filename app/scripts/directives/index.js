'use strict';

var angular = require('angular');

angular.module('easyRaidFinder').directive('raidpost', require('./raidPost'));
angular.module('easyRaidFinder').directive('getstarted', require('./getStarted'));
angular.module('easyRaidFinder').directive('postsfound', require('./postsFound'));
angular.module('easyRaidFinder').directive('nopostsfound', require('./noPostsFound'));
angular.module('easyRaidFinder').directive('joinraidpost', require('./joinRaidPost'));
angular.module('easyRaidFinder').directive('createraidpost', require('./createRaidPost'));
angular.module('easyRaidFinder').directive('whosgoingoverlay', require('./whosgoingoverlay'));
