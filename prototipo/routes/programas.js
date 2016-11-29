var express = require('express');
var passport = require('passport');
var router = express.Router();
var isAuthenticated = require('../utils/login.js');

module.exports = function(app){
  app.use('/', router);
  router.post('/listarProgramas', isAuthenticated, function(req, res) {
      //var programas = ["ghc","happy","nodejs","alex","cat","sleep"];
      // https://hub.docker.com/r/sjackman/bioinformatics/~/dockerfile/
      var programas = ["cat", "test", "rscript"];
      res.json(programas);
  });
};
