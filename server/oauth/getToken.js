'use strict'

//this is my blizzard app info
//wont be added to github...
var secrets = require('./secretInfo'),
    qs = require('querystring'),
    request = require('request'),
    User = require('../models/User');


function getUserToken(code, callback) {
  var redirectUri = "https://localhost:3000",
      scope = "wow.profile",
      key = secrets.client_id,
      secret = secrets.secret,
      grantType = "authorization_code",
      tokenUri = "https://us.battle.net/oauth/token?";

  //this will be the query string needed to
  //request the token successfully.
  var token_params = qs.stringify({
    client_id: key,
    client_secret: secret,
    code: code,
    scope: scope,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri
  });

  //make the request to the token url.
  request(tokenUri + token_params, (err, res, body) => {

    if (err) {
      return console.log(err);
    }

    var body = JSON.parse(body);

    //if we get the unique token
    if (body.hasOwnProperty('access_token')) {
      var token = body['access_token']

      return requestAccount(token, callback);
    }
  });
};

function requestAccount(token, callback) {
  var userApi = 'https://us.api.battle.net/account/user';
  
  //request the users unique account id from blizzard.
  request(userApi + "?access_token=" + token, function(err, res, body) {

    if (err) {
      return console.log(err);
    }

    var body = JSON.parse(body),
        battleTag = body.battletag.split('#')[0],
        account = body.id,
        thisUser = new User({battleTag: battleTag, account: account});

    //add the user account to the database.
    addUserToDatabase(thisUser);

    //send the token and the account battletag back to the client
    return callback({accessToken: token, battleTag: battleTag});
  });
}

function addUserToDatabase(thisUser) {

  User.findOne({account: thisUser.account}, (err, user) => {
    if (err) return console.log(err);
    
    //if the user is not in the database add it.
    if (!user) {
      thisUser.save((err, result) => {
        if (err) return console.log(err);
        console.log('Saved User to database.')
      });
    }
  });
}

module.exports = {
  getUserToken: getUserToken,
  requestAccount: requestAccount,
  addUserToDatabase: addUserToDatabase
}


