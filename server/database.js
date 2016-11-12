'use strict'

var mongoose = require('mongoose');

mongoose.connect('mongodb://yandri:iloveyou@ds031862.mlab.com:31862/easy-raidfinder', function(err) {
  if (err) {
    console.log('Failed connecting to MongoDB!');
  } else {
    console.log('Successfully connected to MongoDB!');
  }
});

mongoose.Promise = global.Promise