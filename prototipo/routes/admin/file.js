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
  router.get('/destroy/:id', isAuthenticated, function(req, res) {
    File.findByIdAndRemove(req.params.id)
      .then((file) => res.redirect("/admin/file"));
  });
};
