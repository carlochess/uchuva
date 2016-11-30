var express = require('express');
var async = require('async');
var path = require('path');
var File = require('../../models/file.js');
var router = express.Router();
var fs = require('fs');
var config = require('../../config');
var isAuthenticated = require('../../utils/login.js');

module.exports = function(app){
  app.use('/', router);

  function renombrar(item, newItemPath,userId, cb) {
    File.findOne({
        _id: item,
        owner : userId
    }, function(err, file) {
        if (err || !file) return cb(err);
        var newName = path.basename(newItemPath);
        file.originalname = newName;
        file.save(cb);
    });
  }

  function mover(items,newItemPath, userId, cb) {
    File.findOne({
        _id: newItemPath,
        type: "dir",
        owner: userId
    }, function(err, folder) {
      if (err) {
          return cb(err);
      }
      File.find({
          _id: {
              $in: items.map(function(o) {
                  return o.id;
              })
          },
          owner: userId
      }, function(err, files) {
          if (err || !files ) {
              return cb(err);
          }
          async.each(files, function(file, cb2) {
            file.parent = folder._id;
            file.save(function(err, f) {
                if (err) {
                    return cb2(err);
                }
                cb2(null);
            });
          }, cb);
      });
    });
  }
  function savefile(item,content, userId, cb) {
      File.findOne({
          _id: item,
          type: "file",
          owner : userId
      }, function(err, file) {
          if (err || !file) return cb(err);
          fs.writeFile(file.path, content, cb);
      });
  }

  router.post("/editarArchivo",isAuthenticated, function(req, res, next) {
      var mode = req.body.action;
      var userId = req.user._id;
      function cb(err, data){
        if(err){
          logger.error("Error "+mode+", "+err);
          return send(err);
        }
        if(data){
          return res.send({result:{result : data}});
        }
        res.send({code:0});
      }
      if (mode === "rename") {
        var item = req.body.item.id;
        var newItemPath = req.body.newItemPath;
        renombrar(item, newItemPath,userId, cb);
      } else if (mode === "edit") {
          var item = req.body.item.id;
          var content = req.body.content;
          savefile(item,content, userId, cb);
      } else {
        var items = req.body.items;
        var newItemPath = req.body.newPath;
        mover(items,newItemPath, userId, cb);
      }
  });
}
