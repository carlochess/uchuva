var _ = require('lodash');
var express = require('express');
var router = express.Router();
var Software = require('../../models/software.js');
var config = require('../../config.js');
var isAuthenticated = require('../../utils/login.js');
var fs = require("fs");

module.exports = function(app){
  app.use('/admin/software', router);
  router.get('/', isAuthenticated, function(req, res) {
    fs.readdir(config.APPSDIR, function(err, softwares){
      if(err){
        return res.redirect("/admin/index");
      }
      return res.render("admin/software/index.pug", {softwares: softwares});
    });
    /*Software.find({})
      .then((softwares) => res.render("admin/software/index.pug", {softwares: softwares}));*/
  });
  router.get('/show/:id', isAuthenticated, function(req, res) {
    Software.findById(req.params.id)
      .then((software) => res.render("admin/software/detalles.pug", {software: software}));
  });
  router.get('/add', isAuthenticated, function(req, res) {
    res.render("admin/software/agregar.pug");
  });
  router.get('/edit/:id', isAuthenticated, function(req, res) {
    Software.findById(req.params.id)
      .then((software) => res.render("admin/software/actualizar.pug", {software: software}));
  });
  router.post('/create', isAuthenticated, function(req, res) {
    Software.create(req.body)
      .then((software) => res.redirect("/admin/software"));
  });
  router.post('/update/:id', isAuthenticated, function(req, res) {
    Software.findById(req.params.id)
    .then((software) => software ? _.merge(software, req.body).save() : null)
      .then((software) => res.redirect("/admin/software"));
  });
  router.get('/destroy/:id', isAuthenticated, function(req, res) {
    Software.findByIdAndRemove(req.params.id)
      .then((software) => res.redirect("/admin/software"));
  });
};
