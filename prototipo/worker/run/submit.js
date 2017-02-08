var fs = require('fs');
var passport = require('passport');
var soap = require('soap');
var path = require('path');
var mongoose = require('mongoose');
var datos = require("./moverdatos");
var htcondor = require("./htcondor");
var loadmanagers = {
  submitToLoadManagers : function(){
    return 0;
  }
};//require("./htcondor");
var controladorArchivos = require('../../utils/file.js');
var config = require('../../config.js');
var DagExe = require('../../models/dagExe.js');

var logger = console; /*{
  error : console.log,
  info : console.log
}*/

mongoose.Promise = require('bluebird');
mongoose.connect(config.DATABASE_URI);
mongoose.connection.on('connected', function() {
    logger.info('Mongoose default connection open to ' + config.DATABASE_URI);
});
mongoose.connection.on('error', function(err) {
    logger.error('Mongoose default connection error: ' + err);
    process.exit(1);
});
mongoose.connection.on('disconnected', function() {
    logger.error('Mongoose default connection disconnected');
});

var newmask = 0000;
var oldmask = process.umask(newmask);
logger.info("Changed umask from "+
  oldmask.toString(8)+" to "+newmask.toString(8));
logger.info("This process is pid "+process.pid);
logger.info("This platform is " + process.platform);
if (process.getuid) {
  logger.info("Current uid: "+process.getuid());
}
if (process.getgid) {
  logger.info("Current gid: "+process.getgid());
}
logger.info("Current directory"+process.cwd());



function ejecutar(dagExeId, cb){
    DagExe.findById(dagExeId, function(err, envio){
      if(err){
        logger.error("Dag no encontrado: ", err);
        cb();
        return;
      }
      var nombreDir = envio.nombre;
      var workloader = envio.tipo;
      datos.trasteo(envio, nombreDir, function(err) {
	if (err) {
	  logger.error("/run Moviendo los ficheros a "+nombreDir);
	  return;
	}
        console.log("Termine")
	if (workloader===0)
	  htcondor.enviarHTC(envio, nombreDir, notificarBlaBla);
	else
	  loadmanagers.submitToLoadManagers(envio, nombreDir,workloader, notificarBlaBla);
      });

      function notificarBlaBla(err, nodes) {
	if (err) {
	  logger.error("/run ",err);
	  return;
	}
	logger.info("Guardando");
	//var dag = search DagExe(nodes);
        envio.sended = true;
	envio.save(function(err) {
	  if (err) {
	    logger.error("/run ",err);
	    return cb();
	  }
	  logger.info("/run Directorio creado " + nombreDir);
          return cb();
	});
      }
    });
}
exports.ejecutar = ejecutar;
exports.kkk = function(){
  return ":D";
};
