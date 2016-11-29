var express = require('express');
var isAuthenticated = require('../utils/login.js');
var router = express.Router();

module.exports = function(app){

  app.use('/', router);

  router.get('/consola', isAuthenticated, function(req, res) {
      res.render('consola');
  });
};
