'use strict';

function VerificationCtrl ($http, $location) {

  //gets the code oAuth sent back, and send it to the server
  //the server will use it to request a private token (browser cant do this, must be server-to-server)
  //if an access_token is granted proceed to profile else send user back to homepage.
  var url = window.location.href;
  var code = url.split('=')[1].split('#')[0];

  $http.post('/callback', {code: code}).then(function(res) {

    if (res.data === 'error') return window.location.href = "https://localhost:3000";
   
    localStorage.setItem( 'battleTag', res.data.battleTag);
    localStorage.setItem( 'access_token', res.data.accessToken);
    $location.path('/profile');
  });
};

module.exports = VerificationCtrl;
