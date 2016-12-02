var express = require('express');
var async = require('async');
var path = require('path');
var DagExe = require('../../models/dagExe.js');
var File = require('../../models/file.js');
var router = express.Router();
var fs = require('fs');
var config = require('../../config');
var isAuthenticated = require('../../utils/login.js');

function fechaActual() {
    return new Date()
        .toISOString()
        .replace(/T/, ' ')
        .replace(/\..+/, '');
}

function front(f) {
    return {
        "name": f.originalname,
        "rights": "drwxr-xr-x",
        "size": f.size,
        "date": f.uploadDate.toISOString().replace(/T/, ' ').replace(/\..+/, ''),
        "type": f.type,
        "id": f._id,
        "veneno": f.veneno
    };
}

function getRootFolder(userId, cb) {
    File.findOne({
        destination: "/",
        type: "dir",
        owner: userId
    }, function(err, folder) {
        if (err) {
            logger.error("Creating using root folder" + err + ", user " + userId);
            return cb(err);
        }
        var idRaiz = folder._id;
        cb(null, idRaiz);
    });
}

module.exports = function(app) {
    app.use('/', router);

    router.post("/buscar", isAuthenticated, function(req, res, next) {
        req.checkBody('filename', 'Invalid filename').notEmpty();
        var errors = req.validationErrors();
        if (errors) {
            var asStr = errors.map(function(e) {
                return e.msg;
            }).join(",");
            res.send({code:1, message: asStr});
            return;
        }
        var filename = req.body.filename;
        File.find({
            originalname: filename,
            owner: req.user._id
        }, function(err, files) {
            if (err) return res.send({code:2, message: err+""});
            files.forEach(function(f) {
                result.result.push(front(f));
            });
            res.send({result: result});
        });
    });

    router.post("/listar", isAuthenticated, function(req, res, next) {
        getRootFolder(req.user._id, function(err, idRaiz) {
            var cwd = false,
                root = false;
            if (req.body.path) {
                cwd = req.body.path.cwd;
                root = req.body.path.path === "/";
            }
            var result = {
                result: []
            };
            if (!cwd) {
                cwd = idRaiz;
                root = true;
            }

            if (!root && cwd.indexOf("/") > -1) {
                var p = cwd.split(path.sep).filter(function(elem) {
                    return elem !== "" && elem !== ".." && elem !== ".";
                });
                if (p.length < 2) {
                    DagExe.find({
                        userid: req.user._id
                    }, null, {
                        sort: {
                            date: -1
                        }
                    }, function(err, dags) {
                        dags.forEach(function(f) {
                            result.result.push(front({
                                originalname: f.nombre,
                                size: "0",
                                uploadDate: new Date(),
                                type: "dir",
                                _id: "/_Runs/" + f.nombre + "/",
                                veneno: ""
                            }));
                        });
                        res.format({
                            html: function() {
                                res.send(result);
                            },
                            json: function() {
                                res.json(result);
                            }
                        });
                    });
                    return;
                } else {
                    var directorio = path.join(config.DAG_DIR, p.slice(1).join(path.sep));
                    fs.readdir(directorio, function(err, dags) {
                        async.mapSeries(
                            dags,
                            function(item, callback) {
                                fs.stat(path.join(directorio, item), function(err, stats) {
                                    var isd = stats.isDirectory();
                                    callback(err, {
                                        originalname: item,
                                        size: stats.size + "",
                                        uploadDate: new Date(),
                                        type: isd,
                                        _id: "/_Runs/" + p.slice(1).join(path.sep) + "/" + item + (isd ? "/" : ""),
                                        veneno: ""
                                    });
                                });
                            },
                            function(err, files) {
                                files.forEach(function(f) {
                                    result.result.push(front(f));
                                });
                                res.format({
                                    html: function() {
                                        res.send(result);
                                    },
                                    json: function() {
                                        res.json(result);
                                    }
                                });
                            });
                    });
                }
            } else {
                function procesar(err, folders) {
                    if (err) return res.send(result);
                    if (!folders || folders.length === 0) {
                        res.send(result);
                        return;
                    }
                    var folderP = folders[0];
                    File.find({
                        parent: folderP._id,
                        owner: req.user._id
                    }, function(err, files) {
                        if (err) return res.send(result);
                        files.unshift(folderP);
                        if (root) {
                            files.push({
                                originalname: "_Runs",
                                size: "0",
                                uploadDate: new Date(),
                                type: "dir",
                                _id: "/_Runs/",
                                veneno: ""
                            });
                        }
                        files.forEach(function(f) {
                            result.result.push(front(f));
                        });
                        res.format({
                            html: function() {
                                res.send(result);
                            },
                            json: function() {
                                res.json(result);
                            }
                        });
                    });
                }

                File.find({
                    _id: cwd,
                    type: "dir"
                }, procesar);
            }
        });
    });
};
