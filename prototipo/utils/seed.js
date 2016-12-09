var mongoose = require('mongoose');
var user = require('../models/user');
mongoose.connect('mongodb://localhost/uchuva');
var users = [
  {
    _id: '559645cd1a38532d14349240',
    name: 'admin',
    friends: []
  },
];

// http://stackoverflow.com/questions/16726330/mongoose-mongodb-batch-insert
mongoose.connection.collections.users.drop( function(err) {
  User.create(users, function(err, res){
    if (err) {
      console.log(err);
    }
    else {
      console.log('Seed data created.');
    }
    process.exit();
  });
});
