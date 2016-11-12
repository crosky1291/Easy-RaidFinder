var mongoose = require('mongoose');

//Create the User Schema
var UserSchema = new mongoose.Schema({
  battleTag: String,
  account: String
});

//Export the model
module.exports = mongoose.model('user', UserSchema);