var _ = require('lodash');
var express = require('express');
var router = express.Router();
var Dag = require('../../models/dag.js');
var isAuthenticated = require('../../utils/login.js');

module.exports = function(app){
  app.use('/admin/dag', router);
  router.get('/', isAuthenticated, function(req, res) {
    Dag.find({})
      .then((dags) => res.render("admin/dag/index.pug", {dags: dags}));
  });
  router.get('/show/:id', isAuthenticated, function(req, res) {
    Dag.findById(req.params.id)
      .then((dag) => res.render("admin/dag/detalles.pug", {dag: dag}));
  });
  router.get('/destroy/:id', isAuthenticated, function(req, res) {
    Dag.findByIdAndRemove(req.params.id)
      .then((dag) => res.redirect("/admin/dag"));
  });
};
