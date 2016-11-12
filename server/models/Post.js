var mongoose = require('mongoose');

//Create the Post Schema
var PostSchema = new mongoose.Schema({
  raidName: String,
  raidDate: String,
  raidTime: String,
  raidFaction: String,
  whosGoing: { type: Array, "default": []}
});

//Export the model
module.exports = mongoose.model('post', PostSchema);