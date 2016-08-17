/**
 * UserFactory belongs here
 */
angular
  .module('Codesmith.UserFactory', [])
  .factory('UserFactory', function() {
    return {
      name: 'yandri',
      age: 25
    };
  });