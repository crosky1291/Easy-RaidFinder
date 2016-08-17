var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// Mongoose connection to MongoDB
mongoose.connect('mongodb://localhost/solo-project');
mongoose.connection.once('open', () => {


    console.log('Connected');
});

var Schema = mongoose.Schema;
var userSchema = new Schema({
    username: String,
    characters: [],
    realms: []
});

var User = mongoose.model('User', userSchema);

app.use(express.static(path.join(__dirname, './client/')));
app.use(bodyParser.json()); // support json encoded bodies

app.get('/profile', function(req, res) {
    console.log(res.code);

// User.find(function(err, user) {
//   if (err) {
//     return console.error(err);
//   }
//   console.log(req);
//   res.send(JSON.stringify(user));
// })
});

// app.post('/profile', function(req, res) {
//     console.log(req);
// });

app.post('/', function(req, res) {
    // console.log(req.body)
    var user = new User(req.body);
    user.save(function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("saved successfully");
        }
    });

    res.status(200).send();
});

app.listen(3000);