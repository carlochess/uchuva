const readline = require('readline');
const fs = require('fs');
const async  = require('async');

var partes = [];

for(var i=0; i<25;i++){
    partes.push("libroa"+String.fromCharCode(97 + i));
}

appendFiles(partes, "file.txt", function(err){
    if(err){
       console.log("Error");
    }
    console.log("Great");
});

function appendFiles(files, file, cb){
  async.map(files, function(f, callback){
    appendFile(f, file, callback);
  }, cb);
}

function appendFile(parte, file, cb){
  fs.readFile(parte, "utf8",function (err, content) {
      if (err) return cb(err);
      return fs.appendFile(file, content, 'utf8', cb);
  });
}
