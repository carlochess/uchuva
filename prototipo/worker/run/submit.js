var fs = require('fs');
var passport = require('passport');
var soap = require('soap');
var path = require('path');
var mongoose = require('mongoose');
var datos = require("./moverdatos");
var htcondor = require("./htcondor");
var loadmanagers = require("./loadmanagers.js");
var controladorArchivos = require('../../utils/file.js');
var config = require('../../config.js');
var DagExe = require('../../models/dagExe.js');

var logger = console;

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

function ejecutar(dagExeId, cb){
    DagExe.findById(dagExeId, function(err, envio){
      if(err){
        logger.error("Dag no encontrado: ", err);
        return cb();
      }
      var nombreDir = envio.nombre;
      var workloader = envio.tipo;
      datos.trasteo(envio, nombreDir, function(err) {
	if (err) {
	  logger.error("/run Moviendo los ficheros a "+nombreDir);
	  return cb(err);
	}
	if (workloader===0)
	  htcondor.enviarHTC(envio, nombreDir, notificarBlaBla);
	else
	  loadmanagers.submitToLoadManagers(envio, nombreDir,workloader, notificarBlaBla);
      });

      function notificarBlaBla(err, nodes) {
	if (err) {
	  logger.error("/run ",err);
	  return cb(err);
	}
	logger.info("Guardando");
        envio.sended = true;
	envio.save(function(err) {
	  if (err) {
	    logger.error("/run ",err);
	    return cb(err);
	  }
	  logger.info("/run Directorio creado " + nombreDir);
          return cb();
	});
      }
    });
}
exports.ejecutar = ejecutar;
