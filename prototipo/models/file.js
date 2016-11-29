var mongoose = require('mongoose');

var fileSchema = mongoose.Schema({
 fieldname: String, //
 filename: String, //
 originalname: String, //
 encoding: String, //
 mimetype : String, //
 size: Number, //
 destination: String, //
 uploadDate : { type: Date, default: Date.now },
 path: String, //
 project: String,
 node: String,
 parent: String,
 type: String,
 owner : String
});

fileSchema.methods = {
  front : function() {
    return {
  	"name": this.originalname,
	"rights": "drwxr-xr-x",
	"size": this.size,
	"date": this.uploadDate.toISOString().replace(/T/, ' ').replace(/\..+/, ''),
	"type": this.type,
	"id": this._id,
    };
  }
};



module.exports = mongoose.model('File', fileSchema);
