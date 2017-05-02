var path = require('path');
var fs = require('fs');
var doT = require("dot");
var argv = require('minimist')(process.argv.slice(2));

var plantillas = ["submitfile", "openlava", "torque", "slurm"];

var arr = plantillas.map(function(p){
  var plantilla = path.join(__dirname,'views',p+'.dot');
  var str = fs.readFileSync(plantilla, 'utf8');
  return doT.template(str, {
    evaluate:    /\{\{([\s\S]+?)\}\}/g,
    interpolate: /\{\{=([\s\S]+?)\}\}/g,
    encode:      /\{\{!([\s\S]+?)\}\}/g,
    use:         /\{\{#([\s\S]+?)\}\}/g,
    define:      /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
    conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
    iterate:     /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
    varname: 'it',
    strip: false,
    append: false,
    selfcontained: false
  });
});

var descfiles = {
  htcondor : arr[0],
  openlava : arr[1],
  torque : arr[2],
  slurm : arr[3]
};
// uchuva --share=/tmp/ --owner=uchuva --logdir=/var/log/uchuva
var share = argv.share || process.env.SHARE || path.join(__dirname,'data');
var dag = argv.dag || process.env.DAG_DIR || path.join(share,'run');
var upload = argv.upload || process.env.UPLOAD_DIR || path.join(share,'uploads');
var condorUrl = process.env.CONDOR_URL || 'http://localhost:8080/';
var condorJobOwner = argv.owner || process.env.CONDOR_JOB_OWNER || process.env.USER || "carlos";
var key = fs.readFileSync(path.join(__dirname,'keys','id_rsa'));
var logdir = argv.logdir ||process.env.LOGDIR || path.join(__dirname,'logs');
var config = function(){
    return {
        SERVER_PORT : process.env.PORT || 3000,
        SERVER_HOST : process.env.HOST || 'http://0.0.0.0',
        DATABASE_URI : process.env.DATABASE_URI || 'mongodb://localhost/uchuva',
        IS_DEVELOPMENT : process.env.NODE_ENV !== 'production',
        IS_TESTING : process.env.NODE_ENV === 'testing',
        BMANAGER : process.env.BMANAGER || 0,
        APPSDIR : path.join(__dirname,'static','appframework'),
        LOGDIR : logdir,
        DATA_DIR : share,
        DAG_DIR : dag,
        UPLOAD_DIR : upload,
        CONDOR_URL : condorUrl,
        CONDOR_JOB_OWNER : condorJobOwner,
        JOB_TEMPLATE : descfiles,//submitfile
        SSHKEY : key,
      QUEUE : process.env.QUEUE || 'amqp://user:password@localhost',
      USESSH : [process.env.HTCONDOR_SSH,process.env.OPENLAVA_SSH,process.env.TORQUE_SSH,process.env.SLURM_SSH],
      USEQUEUE :process.env.USEQUEUE,
      USESOAP :process.env.USESOAP,
      SSHHOSTS : 'openlava,torque,slurm'.split(","),
      SSHPORTS : '22,'.repeat(4).split(","),
      SSHUSERS : 'testuser,'.repeat(4).split(","),
      SOFTWAREA : "rawdocker,raw,bash,cat,head,rscript,alex,echo,ghc,happy,nodejs,racket,sleep,tar,curl,git,mv,mkdir".split(",").map(function(e){return {name : e, filename: e+".js"};})
    };
};

/*crear carpetas
| </>
|- data
|-- run
|-- uploads
*/
function ensureExists(path, mask, cb) {
    if (typeof mask == 'function') { // allow the `mask` parameter to be optional
        cb = mask;
        mask = 0775;
    }
    fs.mkdir(path, mask, function(err) {
        if (err) {
            if (err.code == 'EEXIST') cb(null); // ignore the error if the folder already exists
            else cb(err); // something else went wrong
        } else cb(null); // successfully created folder
    });
}

ensureExists(share, 0775, function(err) {
  if (err){
    console.log("Can't create folder", err);
    process.exit(1);
  }
  ["run","uploads"].map(function(carpeta){
    ensureExists(path.join(share, carpeta), 0775, function(err) {
      if (err){
        console.log("Can't create folder", err);
        process.exit(1);
      }
    });
  });
});
// What happens if the folder gets deleted while your program is running? (assuming you only check that it exists once during startup)
// What happens if the folder already exists but with the wrong permissions?

module.exports = config();
