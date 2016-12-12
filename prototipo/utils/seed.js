var mongoose = require('mongoose');
var User = require('../models/user');
mongoose.connect('mongodb://localhost/uchuva');
var users = [
  {
    name: 'admin3',
    username : 'admin3',
    apikey : 'admin3'
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
