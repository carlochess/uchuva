var express = require('express');
var passport = require('passport');
var router = express.Router();
var isAuthenticated = require('../utils/login.js');
var Software = require('../models/software.js');
var config = require('../config.js');

module.exports = function(app){
  app.use('/', router);
  router.post('/listarProgramas', isAuthenticated, function(req, res) {
    Software.find({ enable : true})
      .catch(function(err){
        return res.json([]);
      })
      .then(function(softwares){
        var programas = softwares.map(function(e){return {name : e.name, filename: e.filename};}).concat(config.SOFTWAREA);
        return res.json(programas);
      });
  });
};
