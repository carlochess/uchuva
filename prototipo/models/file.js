var mongoose = require('mongoose');

var fileSchema = mongoose.Schema({
 fieldname: String, // Field name specified in the form
 filename: String, //
 originalname: String, // Name of the file on the user's computer
 encoding: String, // Encoding type of the file
 mimetype : String, // Mime type of the file
 size: Number, // Size of the file in bytes
 destination: String, // The folder to which the file has been saved
 uploadDate : { type: Date, default: Date.now }, // upload date
 path: String, // The full path to the uploaded file
 vpath : String, // virtual path in the app
 public : { type: Boolean, default: false }, // if the file is public
 parent: String, // folder parent
 type: String, // (dir,file) if its a folder or a file
 owner : String, // owner or the file
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
