'use strict';

var express = require('express');
var Realm = require('../models/Realm');
var Post = require('../models/Post');
var router = express.Router();

//route requests to get raid posts for a specific realm.
router.get('/posts/:realm', (req, res) => {
  var thisRealm = req.params.realm;

  Realm.findOne({ realmName: thisRealm}, (err, realm) => {
    
    if (err) {
      return res.status(500).send(err.message);
    }

    //if realm does not exists
    if (!realm) {
      //create it
      Realm.create({realmName: thisRealm}, (err, realm) => {
        if (err) return console.log(err);
        return console.log('Successfully saved realm ' + thisRealm + ' to database.')
      })
      //let client know that realm was not found.
      return res.status(404);
    } 
    //if realm exits send the posts
    res.status(200).send(realm.posts);
  });
});

//route requests to create a raid post for a specific realm.
router.post('/posts/:realm', (req, res) => {
  var data = req.body;
  var thisRealm = req.params.realm;
  var thisChar = data.character;

  var newPost = new Post({
    raidName: data.name,
    raidDate: data.date,
    raidFaction: data.faction,
    raidTime: data.hour + ":" + data.minute + " " + data.amPm,
  });

  newPost.whosGoing.push(thisChar);

  Realm.findOne({realmName: thisRealm}, (err, realm) => {
    if (err) {
      return res.status(500).send(err.message);
    }

    realm.posts.push(newPost);
    realm.save();
    res.status(200).send('Post created successfully');
  })
});

//route requests to join a specific raid post.
router.put('/:realm/:postId', function(req, res) {
  var data = req.body;
  var thisRealm = req.params.realm;
  var postId = req.params.postId;
  var thisChar = data.character;

  //query the posts of the thisRealm.
  var query = {
    "realmName": thisRealm,
    "posts": { 
      $elemMatch: { 
        "_id": postId
      } 
    }
  }

  //add the character to the array of characters
  //in the correct field.
  var setField = {
    $addToSet: {
      "posts.$.whosGoing": thisChar
    }
  }

  //execute the query/update.
  Realm.update(query, setField, (err, results) => {
    if (err) {
      return res.status(500).send(err.message);
    }

    res.status(200).send('Successfully joined the Raid.');
  });
})

module.exports = router;