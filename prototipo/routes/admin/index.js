var express = require("express");
var isAuthenticated = require('../../utils/login.js');
var router = express.Router();

module.exports = function(app){
  app.use('/admin', router);
  router.get('/index', isAuthenticated, function(req, res) {
    res.render("admin/index.pug");
  });
};
