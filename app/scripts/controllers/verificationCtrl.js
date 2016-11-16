'use strict';

function VerificationCtrl ($http, $location) {
  var url = window.location.href;
  var code = url.split('=')[1].split('#')[0];

  $http.post('/callback', {code: code}).then(function(res) {
    

    if (res.data === 'error') {
      //couldnt get $location to work here after much research fell back to good'ol javascript.
      window.location.href = "https://localhost:3000";
    } else {
      localStorage.setItem( 'battleTag', res.data.battleTag);
      localStorage.setItem( 'access_token', res.data.accessToken);
      $location.path('/profile');
    }
  });
};

module.exports = VerificationCtrl;
