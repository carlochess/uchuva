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

var logger = {
  error : console.log
}

function ejecutar(dagExeId){
    DagExe.findById(dagExeId, function(err, dag){
      if(err){
        logger.error("Dag no encontrado: ", err);
        return;
      }
	var nombreDir = dag.nombre;
	/*controladorArchivos.crearDirectorio(config.DAG_DIR, function(err,nombreDir) {
	    if (err) {
		logger.error("/run Error creando carpeta ejecucion");
		return;
	    }
*/
	    datos.trasteo(envio, nombreDir, function(err) {
		if (err) {
		    logger.error("/run Moviendo los ficheros a "+nombreDir);
		    return;
		}
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
                dag.sended = true;
		dag.save(function(err) {
		    if (err) {
			logger.error("/run ",err);
			return res.send({error : 5, message : "Error guardando"});
		    }
		    logger.info("/run Directorio creado " + nombreDir);
		});
	    }
	});
    //});
}
module.exports.ejecutar = ejecutar;
