var _ = require('lodash');
var express = require('express');
var router = express.Router();
var Workloader = require('../../models/workloader.js');
var isAuthenticated = require('../../utils/login.js');

module.exports = function(app){
  app.use('/admin/workloader', router);
  router.get('/', isAuthenticated, function(req, res) {
    Workloader.find({})
      .then((workloaders) => res.render("admin/workloader/index.pug", {workloaders: workloaders}));
  });
  router.get('/show/:id', isAuthenticated, function(req, res) {
    Workloader.findById(req.params.id)
      .then((workloader) => res.render("admin/workloader/detalles.pug", {workloader: workloader}));
  });
  router.get('/add', isAuthenticated, function(req, res) {
    res.render("admin/workloader/agregar.pug");
  });
  router.get('/edit/:id', isAuthenticated, function(req, res) {
    Workloader.findById(req.params.id)
      .then((workloader) => res.render("admin/workloader/actualizar.pug", {workloader: workloader}));
  });
  router.post('/create', isAuthenticated, function(req, res) {
    Workloader.create(req.body)
      .then((workloader) => res.redirect("/admin/workloader"));
  });
  router.post('/update/:id', isAuthenticated, function(req, res) {
    Workloader.findById(req.params.id)
    .then((workloader) => workloader ? _.merge(workloader, req.body).save() : null)
      .then((workloader) => res.redirect("/admin/workloader"));
  });
  router.get('/destroy/:id', isAuthenticated, function(req, res) {
    Workloader.findByIdAndRemove(req.params.id)
      .then((workloader) => res.redirect("/admin/workloader"));
  });
};
