var express = require('express');
var tar = require('tar-fs');
var path = require('path');
var File = require('../../models/file.js');
var router = express.Router();
var fs = require('fs');
var config = require('../../config');
var isAuthenticated = require('../../utils/login.js');

module.exports = function(app){
    app.use('/', router);

  router.get("/descargarArchivo", isAuthenticated, function(req, res, next) {
      //req.checkQuery('path', 'Invalid path').notEmpty().isJSON();
      req.checkQuery('path.id', 'Invalid path id').notEmpty();

      var errors = req.validationErrors();
      if (errors) {
          var asStr = errors.map(function(e){
            return e.msg;
          }).join(",");

          res.send({code : 1, message : asStr});
          return;
      }
      var item = req.query.path;
      if (item.id)
          item = item.id;
      var userid = req.user._id;

      if (item.indexOf("/") > -1) {
          var p = item.split(path.sep).filter(function(elem) {
              return elem !== "" && elem !== ".." && elem !== ".";
          });
          if (p.length > 1) {
              var directorio = path.join(config.DAG_DIR, p.slice(1).join(path.sep));
              fs.stat(directorio, function(err, stats) {
                  if (err) {
                      res.send({code:-1});
                      return;
                  }
                  res.download(directorio, path.basename(item));
              });
          }
          else {
            res.send({code:-1});
          }
      } else {
          File.findOne({
              _id: item,
              type: "file",
              owner: userid
          }, function(err, file) {
              if (err){
                logger.error("/descargarArchivo "+err+", user: "+userId);
                return res.send({code:-1});
              }
              if (!file) {
                logger.error("/descargarArchivo file not found, user: "+userId);
                res.send({code:2});
                return;
              }
              res.download(file.path, file.originalname);
          });
      }
  });


  router.get("/descargarMultiple", isAuthenticated, function(req, res, next) {
      var items = req.query.items;
      var userid = req.user._id;
      File.find({
          _id: {
              $in: items.map(function(o) {
                  return o.id;
              })
          },
          type: "file",
          owner: userid
      }, function(err, files) {
          if (err) {
            logger.error("/descargarArchivo "+err+", user: "+userId);
            return res.send(err);
          }
          if (!files) {
            logger.error("/descargarArchivo file not found, user: "+userId);
            return res.send(err);
          }
          res.setHeader('Content-disposition', 'attachment; filename=uchuva.tar');
          res.setHeader('Content-type', 'application/octet-stream');

          tar.pack(config.UPLOAD_DIR, {
              entries: files.map(function(o) {
                  return o.filename;
              }),
              map: function(header) {
                  header.name = files.filter(function(v) {
                      return header.name === v.filename;
                  })[0].originalname;
                  return header;
              }
          }).pipe(res);
      });
  });
};
