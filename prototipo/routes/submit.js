var fs = require('fs');
var express = require('express');
var passport = require('passport');
var router = express.Router();
var soap = require('soap');
var path = require('path');
var logger = require('../utils/logger.js');
var controladorArchivos = require('../utils/file.js');
var mongoose = require('mongoose');
var config = require('../config.js');
var DagExe = require('../models/dagExe.js');
var datos = require("./moverdatos");
var htcondor = require("./htcondor");
var loadmanagers = require("./loadmanagers");
var isAuthenticated = require('../utils/login.js');

module.exports = function(app){
  app.use('/', router);

  router.post('/run', isAuthenticated, function(req, res) {
      if (req.body.body)
          req.body = req.body.body;

      req.checkBody('proyecto', 'Invalid project id').notEmpty().isMongoId();
      req.checkBody('nodes', 'Invalid nodes').optional().isArrayOfNodes();
      req.checkBody('edges', 'Invalid edges').optional().isArrayOfEdges();
      //req.checkBody('imagen', 'Invalid image').optional().isAlphanumeric();
      var errors = req.validationErrors();
      if (errors) {
          var asStr = errors.map(function(e){
            return e.msg;
          }).join(",");
          res.send({error : 1, message : asStr});
          return;
      }
      
      var envio = req.body;
      var proyecto = envio.proyecto;

      controladorArchivos.crearDirectorio(config.DAG_DIR, function(err,nombreDir) {
          if (err) {
              res.send("Error creando carpeta");
              return;
          }

          datos.trasteo(envio, nombreDir, function(err) {
              if (err) {
                  res.send("Error archivos");
                  return;
              }
              if (config.BMANAGER === 0)
                  htcondor.enviarHTC(envio, nombreDir, notificarBlaBla);
              else
                  loadmanagers.submitToLoadManagers(envio, nombreDir, notificarBlaBla);
          });

          function notificarBlaBla(err, nodes) {
              if (err) {
                  logger.info(err);
                  res.send("Error");
                  return;
              }
              logger.info("Guardando");
              var dag = new DagExe({
                  nombre: nombreDir,
                  descripcion: "[Editar]",
                  proyecto: envio.proyecto,
                  nodes: nodes || envio.nodes,
                  edges: envio.edges,
                  userid: req.user._id,
                  ejecuciones: [],
                  imagen: envio.imagen,
                  tipo: config.BMANAGER
              });
              dag.save(function(err) {
                  if (err) {
                      res.send("error");
                      logger.info(err);
                      return;
                  }
                  res.format({
                      html: function() {
                          res.send(nombreDir);
                      },
                      json: function() {
                          res.json({
                              id: nombreDir
                          });
                      }
                  });
                  logger.info("Directorio creado " + nombreDir);
              });
          }
      });
  });
};
