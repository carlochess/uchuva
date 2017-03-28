var express = require('express');
var async = require('async');
var path = require('path');
var File = require('../../models/file.js');
var router = express.Router();
var fs = require('fs');
var config = require('../../config');
var isAuthenticated = require('../../utils/login.js');

module.exports = function(app) {
    app.use('/', router);

    function remover(file, cb) {
        fs.stat(file.path, function(err, stats) {
            if(err){
              return cb(err);
            }
            if (stats.isFile()) {
              return fs.unlink(file.path, cb);
            }
            return cb("File doesn't exists");
        });
    }

    function recursiveDelete(arrFiles, cb) {
        var ficheros = arrFiles; // ficheros must be a set (don't repeat elems)
        async.whilst(function() {
            return ficheros.length !== 0;
        }, function(callback) {
            var fichero = ficheros.shift();
            if (fichero.type !== "file") {
                File.find({
                    parent: fichero._id.toString()
                }, function(err, hijos) {
                    if (err) {
                        callback(err);
                        return;
                    }
                    // check for repeated
                    if (hijos) {
                        ficheros = ficheros.concat(hijos);
                    }
                    fichero.remove(callback);
                });
            } else if (fichero.type === "file") {
                remover(fichero, function(err) {
                    if (err) {
                        callback(err);
                        return;
                    }
                    fichero.remove(callback);
                });
            }
        }, cb);
    }

    router.post("/eliminarArchivo", isAuthenticated, function(req, res, next) {
        /*req.checkBody('items', 'Invalid array of ids').optional().isArrayOfMongoId();
        req.checkBody('item', 'Invalid id').optional().isMongoId();*/
        /*var errors = req.validationErrors();
        if (errors) {
            var asStr = errors.map(function(e){
              return e.msg;
            }).join(",");
            return res.send({code:2, message: asStr+""});
            return;
        }*/
        var items = req.body.items;
        var userid = req.user._id;
        if (req.body.item)
            items = [{
                id: req.body.item
            }];

        File.find({
            _id: {
                $in: items.map(function(o) {
                    return o.id;
                })
            },
            owner: userid,
            filename: { $ne: "/" }
        }, function(err, files) {
            if (err) {
                return res.send({code:2, message: err+""});
            }
            recursiveDelete(files, function(err) {
                if (err) {
                  return res.send({code:3, message: err+""});
                }
                res.send({success : 0});
            });
        });
    });
};
