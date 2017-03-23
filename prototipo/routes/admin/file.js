var _ = require('lodash');
var express = require('express');
var router = express.Router();
var File = require('../../models/file.js');
var isAuthenticated = require('../../utils/login.js');

module.exports = function(app){
  app.use('/admin/file', router);
  router.get('/', isAuthenticated, function(req, res) {
    File.find({filename: { $ne: "/" }})
      .then((files) => res.render("admin/file/index.pug", {files: files}));
  });
  router.get('/show/:id', isAuthenticated, function(req, res) {
    File.findById(req.params.id)
      .then((file) => res.render("admin/file/detalles.pug", {file: file}));
  });
  router.get('/add', isAuthenticated, function(req, res) {
    res.render("admin/file/agregar.pug");
  });
  router.get('/edit/:id', isAuthenticated, function(req, res) {
    File.findById(req.params.id)
      .then((file) => res.render("admin/file/actualizar.pug", {file: file}));
  });
  router.post('/create', isAuthenticated, function(req, res) {
    File.create(req.body)
      .then((file) => res.redirect("/admin/file"));
  });
  router.post('/update/:id', isAuthenticated, function(req, res) {
    File.findById(req.params.id)
    .then((file) => file ? _.merge(file, req.body).save() : null)
      .then((file) => res.redirect("/admin/file"));
  });
  router.get('/destroy/:id', isAuthenticated, function(req, res) {
    File.findByIdAndRemove(req.params.id)
      .then((file) => res.redirect("/admin/file"));
  });
};
