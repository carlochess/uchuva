const readline = require('readline');
const fs = require('fs');
var https = require('https');
const url = require('url');



const rl = readline.createInterface({
  input: fs.createReadStream('urls.txt')
});

rl.on('line', (line) => {
  var {hostname, path} = url.parse(line)
  var namefile = (`${hostname}/${path}`).replace(/[^a-z0-9]/gi, '_').toLowerCase()
  var file = fs.createWriteStream(`mp/${namefile}`)
  https.get(line, (res) => {
      console.log('statusCode:', res.statusCode);
      console.log('headers:', res.headers);
      console.log('hostname:', namefile);
      

      res.on('data', (d) => {
        file.write(d);
      });

    }).on('error', (e) => {
      console.error(e);
    });
});
