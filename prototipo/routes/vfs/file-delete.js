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

  router.post("/eliminarArchivo", isAuthenticated, function(req, res, next) {
    var items = req.body.items;
    if (req.body.item)
        items = [{
            id: req.body.item
        }];
    var result = {
        result: {
            success: true,
            error: null
        }
    };

    var expectedLoadCount = items.length;
    var loadCount = 0;

    function remover(file) {
        file.remove(function(err, f) {
            if (err) return res.send(result);
            if (file.type === "file") {
                fs.exists(file.path, function(exists) {
                    if (exists) {
                        fs.unlinkSync(file.path);
                    }
                });
            }
            if (++loadCount === expectedLoadCount) {
                res.format({
                    html: function() {
                        res.send(result);
                    },
                    json: function() {
                        res.json(result);
                    }
                });
            }
        });
    }

    function eliminarArchivos(items) {
        items.forEach(function(item) {

            File.find({
                _id: item.id
            }, function(err, files) {
                if (err) return res.send(result);
                if (!files || files.length != 1) {
                    return;
                }
                var file = files[0];
                var hijos = [];

                if (file.type !== "file") {
                    File.find({
                        parent: file._id
                    }, function(hijos) {
                        if (hijos)
                            expectedLoadCount += hijos.length;
                        remover(file);
                        if (hijos)
                            eliminarArchivos(hijos);
                    });
                } else {
                    remover(file);
                }
            });
        });
    }
    eliminarArchivos(items);
  });
};
