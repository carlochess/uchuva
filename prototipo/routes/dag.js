var express = require('express');
var router = express.Router();
var passport = require('passport');
var superheroes = require('superheroes');
var logger = require('../utils/logger.js');
var controladorArchivos = require('../utils/file.js');
var Dag = require('../models/dag.js');
var isAuthenticated = require('../utils/login.js');
var paginate = require('express-paginate');

module.exports = function(app){
  app.use('/', router);

  router.get('/user', isAuthenticated, function(req, res) {
      Dag.paginate({
          userid: req.user._id
      }, {
        page: req.query.page,
        limit: req.query.limit,
        sort: {
          date: -1
        }
      }, function(err, result) {
          var dags = result.docs;
          var itemCount= result.limit;
          var pageCount= Math.ceil(result.total/itemCount);
          if(err){
            logger.error("GET /user Error trying to get dags: "+err);
            dags=[];
          }
          var pages = paginate.getArrayPages(req)(itemCount, pageCount, req.query.page);
          res.format({
              html: function() {
                  res.render('home', {
                      user: req.user,
                      dags: dags,
                      title: "Home",
                      mensajes : req.flash('error'),
                      pageCount: pageCount,
                      itemCount: itemCount,
                      pages: pages
                  });
              },
              json: function() {
                  res.json(dags);//pageCount: pageCount,itemCount: itemCount,
              }
          });
      });
  });

  function crearDag(userId, cb) {
      var superh = superheroes.random();
      var dag = new Dag({
          nombre: superh,
          descripcion: "[Editar]",
          nodes: [],
          edges: [],
          userid: userId,
          ejecuciones: []
      });
      dag.save(function(err) {
          if (err) {
              cb("Error saving");
              return;
          }
          cb(null, {nombre: superh,id: dag._id});
      });
  }

  router.get('/crearDag', isAuthenticated, function(req, res, next) {
      var user = req.user;
      var userId = user._id;
      crearDag(userId ,function(err, dagMetaData) {
        if (err) {
            logger.error("GET /crearDag "+err+", user: "+userId);
            res.format({
                html: function() {
                    req.flash('error', err);
                    res.redirect("/user");
                },
                json: function() {
                    res.json({
                      code : 1, message : err
                    });
                }
            });
            return;
        }
        res.format({
            html: function() {
                res.redirect("/editar?id=" + dagMetaData.id);
            },
            json: function() {
                res.json(dagMetaData);
            }
        });
      });
  });

  function editar(dagId, userId, cb) {
      Dag.findOne({
          _id: dagId,
          userid: userId
      }, function(err,dag){
        if(err){
          return cb(err);
        }
        if (!dag) {
           return cb("No existe el dag");
        }
        return cb(null, dag);
      });
  }

  router.get('/editar', isAuthenticated, function(req, res) {
      req.checkQuery('id', 'Invalid id').notEmpty().isMongoId();
      var errors = req.validationErrors();
      if (errors) {
          var asStr = errors.map(function(e){
            return e.msg;
          }).join(",");
          logger.error("GET /editar "+asStr);
          res.format({
              html: function() {
                  req.flash('error', asStr);
                  res.redirect('/user');
              },
              json: function() {
                  res.json({code : 1, message : asStr});
              }
          });
          return;
      }
      var dagId = req.query.id;
      var user = req.user;
      var userId = user._id;
      var showTutorial = false;
      if(!user.dagtutorialdone){
        user.dagtutorialdone = true;
        showTutorial = true;
        user.save();// Irresponsable
      }
      editar(dagId, userId, function(error, dag) {
          if (error) {
            logger.error("GET /editar "+error+" usuario "+userId);
            res.format({
                html: function() {
                    req.flash('error', error);
                    res.redirect('/user');
                },
                json: function() {
                    res.json({code : 2, message : error});
                }
            });
            return;
          }
          if(dag.nodes){
            for(var i=0; i< dag.nodes.length; i++){
              var node = dag.nodes[i];
              if(node.configurado && !node.configurado.name){
                node.configurado=false;
              }
            };
          }
          res.format({
              html: function() {
                res.render('dagman', {
                    proyecto: dag._id,
                    nodes: JSON.stringify(dag.nodes),
                    edges: JSON.stringify(dag.edges),
                    title: dag.nombre,
                    workloader : dag.workloader,
                    showTutorial : showTutorial
                });
              },
              json: function() {
                res.json(dag);
              }
          });
      });
  });

  router.post('/save', isAuthenticated, function(req, res) {
      if (req.body.body)
          req.body = req.body.body;

      req.checkBody('proyecto', 'Invalid project id').notEmpty().isMongoId();
      req.checkBody('nodes', 'Invalid nodes').optional().isArrayOfNodes();
      req.checkBody('edges', 'Invalid edges').optional().isArrayOfEdges();
      //req.checkBody('imagen', 'Invalid image').optional().isAlphanumeric();
      req.checkBody('workloader', 'Invalid workloader').optional();
      var errors = req.validationErrors();
      if (errors) {
          var asStr = errors.map(function(e){
            return e.msg;
          }).join(",");
          logger.error("POST /save "+asStr);
          res.send({error : 1, message : asStr});
          return;
      }

      var proyecto = req.body.proyecto;
      var nodes = req.body.nodes;
      var edges = req.body.edges;
      var imagen = req.body.imagen;
      var workloader = req.body.workloader;
      var userId = req.user._id;

      var where = {
          _id: proyecto,
          userid: userId
      };
      Dag.findOneAndUpdate(where, {
          nodes: nodes,
          edges: edges,
          imagen: imagen,
          workloader:workloader
      }, {new : true}, function(err, d) {
          if (err || !d) {
              logger.error("POST /save Error saving dag "+err+", user: "+userId);
              res.send({
                error: 2,
                message: err
              });
              return;
          }
          res.send({
            error: 0,
            message: "Guardado"
          });
      });
  });

  function eliminarDag(idBuild, userId, cb) {
      Dag.findOneAndRemove({
          _id: idBuild,
          userid: userId
      }, cb );
  }

  router.get('/eliminarDag', isAuthenticated, function(req, res) {
      req.checkQuery('id', 'Invalid id').notEmpty().isMongoId();
      var errors = req.validationErrors();
      if (errors) {
          var asStr = errors.map(function(e){
            return e.msg;
          }).join(",");
          res.format({
              html: function() {
                  req.flash('error', asStr);
                  res.redirect('/user');
              },
              json: function() {
                  res.json({code : 1, message:asStr});
              }
          });
          return;
      }
      var idBuild = req.query.id;
      var userId = req.user._id;
      eliminarDag(idBuild, userId, function(error, dag) {
        var errcode = 0;
        if(error || !dag){
          errcode = 2;
          error = error || "Dag no encontrado";
        }
        res.format({
            html: function() {
              if(error){
                req.flash('error', error);
              }
              res.redirect("/user");
            },
            json: function() {
                res.json({
                    code: errcode
                });
            }
        });
      });
  });
};
