var request = require('request');
var fs = require('fs');
// node:7.7-alpine
request('http://www.gstatic.com/tv/thumb/tvbanners/10810505/p10810505_b_v8_aa.jpg').pipe(fs.createWriteStream('doodle.jpg'))

