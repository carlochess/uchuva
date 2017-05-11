var express = require('express');
var router = express.Router();
var parser = require('../utils/classadparser/classAdParser.js');
var controladorArchivos = require('../utils/file.js');
var config = require('../config.js');
var logger = require('../utils/logger.js');
var path = require('path');
var DagExe = require('../models/dagExe.js');
var passport = require('passport');
var isAuthenticated = require('../utils/login.js');

module.exports = function(app){
  app.use('/', router);
  // llamada ajax para conocer el estado de un grafo
  router.post('/statusdag', isAuthenticated, function(req, res) {
      var envio = req.body;
      var dag = envio.idEjecucion;
      var where = {
          nombre: dag,
          userid: req.user._id
      };
      DagExe.findOne(where, function(err, d) {
          if (err) {
              res.send({
                  error: "Dag no encontrado"
              });
              logger.info(err);
              return;
          }
          if (d.tipo === 0) {
              controladorArchivos.leerArchivo(path.join(config.DAG_DIR, dag) + "/status", function(err, data) {
                  if (err) {
                      res.send({
                          error: "Archivo no encontrado"
                      });
                      logger.info(err);
                      return;
                  }
                  var envio = parser.classAdToJson(data);
                  res.send(envio);
              });
          }/* else if (d.tipo == 1) { // openlava
              var comm = spawn("bjobs", ["-noheader", "-a", "-o", "JOBID", "-o", "STAT", d.nodos.map(function(n) {
                  return n.id;
              }).join(" ")]);
              var salida = comm.stdout.toString(); //+comm.stderr.toString();
              res.send({
                  data: salida
              });
          } else if (d.tipo == 2) { // torque
              res.send({});
          } else if (d.tipo == 3) { // slurm
              // var col = ["JobID","Jobname","state"]
              var comm = spawn("sacct", ["j", d.nodos.map(function(n) {
                  return n.id;
              }).join(","), "-n", "-p", "--format=" + col.join(",")]);
              var salida = comm.stdout.toString(); //+comm.stderr.toString();
              res.send({
                  data: salida
              });
          }*/else{
              res.send({
                  error: "Not found"
              });
          }
      });
  });

  router.get('/datanodedag', isAuthenticated, function(req, res, next) {
      /*req.checkBody('idEjecucion', 'Invalid id exe').notEmpty();
      req.checkBody('nodo.title', 'Invalid node title').notEmpty();
      req.checkBody('nodo.id', 'Invalid node id').notEmpty();
      req.checkBody('tipo', 'Invalid type').notEmpty();
      req.checkBody('index', 'Invalid index').notEmpty()
      var errors = req.validationErrors();
      if (errors) {
          var asStr = errors.map(function(e){
            return e.msg;
          }).join(",");
          res.send({
              code : 1,
              error: asStr
          });
          return;
      };*/
      var envio = req.query;
      var dag = envio.idEjecucion;
      var nodo = {};
      nodo.title = envio.title;
      nodo.id = envio.id;
      var nombre = (nodo.title + "_" + nodo.id).replace(/[^a-z0-9]/gi, '_').toLowerCase();
      var tipo = envio.tipo; // log, err, out
      var index = envio.index;
      var archivo = path.join(config.DAG_DIR, dag, nombre+ (index>1?"."+index:"") + "." + tipo);
      controladorArchivos.copiarArchivo(archivo, res, function(err){
        if(err){
          return res.send("No data");
        }
        return next();
      });
  });

  router.post('/datanodedag', isAuthenticated, function(req, res, next) {
      /*req.checkBody('idEjecucion', 'Invalid id exe').notEmpty();
      req.checkBody('nodo.title', 'Invalid node title').notEmpty();
      req.checkBody('nodo.id', 'Invalid node id').notEmpty();
      req.checkBody('tipo', 'Invalid type').notEmpty();
      req.checkBody('index', 'Invalid index').notEmpty()
      var errors = req.validationErrors();
      if (errors) {
          var asStr = errors.map(function(e){
            return e.msg;
          }).join(",");
          res.send({
              code : 1,
              error: asStr
          });
          return;
      };*/

      var envio = req.body;
      var dag = envio.idEjecucion;
      var nodo = envio.nodo;
      var nombre = (nodo.title + "_" + nodo.id).replace(/[^a-z0-9]/gi, '_').toLowerCase();
      var tipo = envio.tipo; // log, err, out
      var archivo = path.join(config.DAG_DIR, dag, nombre+ (envio.index>1?"."+envio.index:"") + "." + tipo);
      controladorArchivos.copiarArchivoOpts(archivo, res, {start: 0, end: 500}, next);
  });
};
