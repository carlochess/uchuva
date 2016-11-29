var mongoose = require('mongoose');

var SoftwareSchema = mongoose.Schema({
    name: String,
    enable : Boolean,
    downloaded: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Software', SoftwareSchema);
