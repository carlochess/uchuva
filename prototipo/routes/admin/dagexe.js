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
  router.get('/destroy/:id', isAuthenticated, function(req, res) {
    Dagexe.findByIdAndRemove(req.params.id)
      .then((dagexe) => res.redirect("/admin/dagexe"));
  });
};
