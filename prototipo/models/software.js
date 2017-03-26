var mongoose = require('mongoose');

var SoftwareSchema = mongoose.Schema({
    name: String,
    enable : { type: Boolean, default: true },
    filename: String,
    path: String,
    downloaded: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Software', SoftwareSchema);
