var fs = require('fs');
//var express = require('express');
var passport = require('passport');
var soap = require('soap');
var path = require('path');
var mongoose = require('mongoose');
var datos = require("./moverdatos");
var htcondor = require("./htcondor");
//var loadmanagers = require("./loadmanagers");
//var logger = require('../utils/logger.js');
var controladorArchivos = require('../utils/file.js');
var config = require('../config/config.js');
//var isAuthenticated = require('../utils/login.js');
var DagExe = require('../models/dagExe.js');
//var router = express.Router();

function ejecutar(dagExeId){
    DagExe.findById({id : dagExeId }, function(err, dag){
	//var nombreDir = dag.nombre;
	controladorArchivos.crearDirectorio(config.DAG_DIR, function(err,nombreDir) {
	    if (err) {
		logger.error("/run Error creando carpeta ejecucion");
		return;
	    }

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
		var dag = search DagExe(nodes);

		dag.save(function(err) {
		    if (err) {
			logger.error("/run ",err);
			return res.send({error : 5, message : "Error guardando"});
		    }
		    logger.info("/run Directorio creado " + nombreDir);
		});
	    }
	});
    });
}
