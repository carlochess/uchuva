var _ = require('lodash');
var express = require('express');
var router = express.Router();
var Software = require('../../models/software.js');
var config = require('../../config.js');
var isAuthenticated = require('../../utils/login.js');
var fs = require("fs");
var path = require("path");
var multer  = require('multer');
var appframeworkDir = path.join(__dirname,'..','..','appframework');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, appframeworkDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname+Date.now()+".js");
  }
});
var upload = multer({ storage: storage });

module.exports = function(app){
  app.use('/admin/software', router);
  router.get('/', isAuthenticated, function(req, res) {
    Software.find({})
      .then((softwares) => res.render("admin/software/index.pug", {softwares: softwares}));
  });
  router.get('/show/:id', isAuthenticated, function(req, res) {
    Software.findById(req.params.id)
      .then((software) => res.render("admin/software/detalles.pug", {software: software}));
  });
  router.get('/add', isAuthenticated, function(req, res) {
    res.render("admin/software/agregar.pug");
  });
  router.get('/toggle/:id', isAuthenticated, function(req, res) {
      Software.findById(req.params.id).then(function(software){
        software.enable = !software.enable;
        software.save(function(err){
          res.redirect("/admin/software");
        });
      });
  });
  router.get('/edit/:id', isAuthenticated, function(req, res) {
      Software.findById(req.params.id).then(function(software){
           fs.readFile(path.join(software.path,software.filename), function(err, softwareData){
               res.render("admin/software/actualizar.pug", {software: software, softwareData: softwareData});
           });
      });
  });
  router.post('/create', isAuthenticated, function(req, res) {
    var filename = req.body.name+Date.now()+".js";
    fs.writeFile(path.join(appframeworkDir,filename), req.body.data, function(err){
      req.body.path = appframeworkDir;
      req.body.filename = filename;
      Software.create(req.body)
            .then((software) => res.json({error : 0}));
    });
  });
  router.post('/createfile', isAuthenticated, upload.single('software'),  function(req, res) {
    req.file.name = req.file.originalname;
    Software.create(_.merge(req.file, req.body))
      .then((software) => res.json({error : 0}));
  });
  router.post('/update/:id', isAuthenticated, function(req, res) {
    Software.findById(req.params.id)
    .then((software) => software ? _.merge(software, req.body).save() : null)
          .then(function(software) {
              fs.writeFile(path.join(appframeworkDir,software.filename), req.body.data, function(err){
                 res.json({error : 0});
              });
          });
  });
  router.get('/destroy/:id', isAuthenticated, function(req, res) {
    Software.findByIdAndRemove(req.params.id)
          .then((software) => fs.unlink(path.join(appframeworkDir,software.filename), (err) => res.redirect("/admin/software")));
  });
};
