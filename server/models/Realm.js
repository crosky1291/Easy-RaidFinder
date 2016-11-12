var mongoose = require('mongoose');
var PostSchema = require('./Post').schema;

//Create the Realm Schema
var RealmSchema = new mongoose.Schema({
  realmName: String,
  posts: [PostSchema]
});

//Export the model
module.exports = mongoose.model('realm', RealmSchema);