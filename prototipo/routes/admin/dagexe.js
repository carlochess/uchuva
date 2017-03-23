var _ = require('lodash');
var express = require('express');
var router = express.Router();
var Dagexe = require('../../models/dagExe.js');
var isAuthenticated = require('../../utils/login.js');

module.exports = function(app){
  app.use('/admin/dagexe', router);
  router.get('/', isAuthenticated, function(req, res) {
    Dagexe.find({})
      .then((dagexes) => res.render("admin/dagexe/index.pug", {dagexes: dagexes}));
  });
  router.get('/show/:id', isAuthenticated, function(req, res) {
    Dagexe.findById(req.params.id)
      .then((dagexe) => res.render("admin/dagexe/detalles.pug", {dagexe: dagexe}));
  });
  router.get('/add', isAuthenticated, function(req, res) {
    res.render("admin/dagexe/agregar.pug");
  });
  router.get('/edit/:id', isAuthenticated, function(req, res) {
    Dagexe.findById(req.params.id)
      .then((dagexe) => res.render("admin/dagexe/actualizar.pug", {dagexe: dagexe}));
  });
  router.post('/create', isAuthenticated, function(req, res) {
    Dagexe.create(req.body)
      .then((dagexe) => res.redirect("/admin/dagexe"));
  });
  router.post('/update/:id', isAuthenticated, function(req, res) {
    Dagexe.findById(req.params.id)
    .then((dagexe) => dagexe ? _.merge(dagexe, req.body).save() : null)
      .then((dagexe) => res.redirect("/admin/dagexe"));
  });
  router.get('/destroy/:id', isAuthenticated, function(req, res) {
    Dagexe.findByIdAndRemove(req.params.id)
      .then((dagexe) => res.redirect("/admin/dagexe"));
  });
};
