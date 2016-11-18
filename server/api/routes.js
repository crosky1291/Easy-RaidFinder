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
      
    }

    //let client know that there are no posts.
    if (realm.posts.length === 0) {
      return res.status(204).send();
    } 

    //if realm exits send the posts
    res.status(200).send(realm.posts);
  });
});

//route requests to create a raid post for a specific realm.
router.post('/posts/:realm', (req, res) => {
  var data = req.body,
      realm = req.params.realm,
      character = data.character;
  character.role = data.role;

  var newPost = new Post({
    raidName: data.name,
    raidDate: data.date,
    raidFaction: data.faction,
    raidTime: data.hour + ":" + data.minute + " " + data.amPm,
  });

  newPost.whosGoing.push(character);

  Realm.findOne({realmName: realm}, (err, realm) => {
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
  var character = req.body,
      realm = req.params.realm,
      postId = req.params.postId;

  //query the posts of the thisRealm.
  var query = {
    "realmName": realm,
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
      "posts.$.whosGoing": character
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
