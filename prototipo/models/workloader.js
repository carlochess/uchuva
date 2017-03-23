var mongoose = require('mongoose');

var WorkloaderSchema = mongoose.Schema({
    name: String,
    enable : Boolean
});
module.exports = mongoose.model('Workloader', WorkloaderSchema);
