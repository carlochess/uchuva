var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = mongoose.Schema({
    name: String,
    email: String,
    username: {
        type: String,
        min: [4, 'Min name length: 4'],
        max: [12, 'Max name length: 12'],
        required: [true, 'You must have an user name'],
        validate: {
          validator: function(v) {
            return /^[a-zA-Z0-9_-]{4,12}$/.test(v);
          },
          message: '{VALUE} is not a valid user name!'
        }
    },
    apikey: String,
    dagtutorialdone: { type: Boolean, default: false },
    lastConnection: { type: Date, default: Date.now }
});

UserSchema.plugin(passportLocalMongoose, {usernameLowerCase : true, });

module.exports = mongoose.model('User', UserSchema);
