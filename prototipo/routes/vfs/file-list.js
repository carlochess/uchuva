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
                res.send({
                    code: 1,
                    message: asStr
                });
                return;
            }
            var filename = req.body.filename;
            File.find({
                originalname: filename,
                owner: req.user._id
            }, function(err, files) {
                if (err) return res.send({
                    code: 2,
                    message: err + ""
                });
                files && files.forEach(function(f) {
                    result.result.push(front(f));
                });
                res.send({
                    files: files
                });
            });
        });

        function listDagExeFolders(userId, cb) {
            DagExe.find({
                userid: userId
            }, null, {
                sort: {
                    date: -1
                }
            }, function(err, dags) {
                if (err) {
                    cb(err)
                }
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
                cb(dags);
            });
        }

        function listDagExeFiles(path, p, userId, cb) {
            var directorio = p.slice(1).join(path.sep);
            DagExe.findOne({
                    userid: userId
                    nombre: directorio;
                }, function(err, dag) {
                    if (err || !dag) {
                        return cb("Exe doesn't exists");
                    }
                    fs.readdir(path.join(config.DAG_DIR, directorio), function(err, dags) {
                        if (err) {
                            return cb(err);
                        }
                        async.mapSeries(
                            dags,
                            function(item, callback) {
                                fs.stat(path.join(config.DAG_DIR, directorio, item), function(err, stats) {
                                    var isd = stats.isDirectory();
                                    if (err) {
                                        return callback({});
                                    }
                                    callback(null, {
                                        originalname: item,
                                        size: stats.size + "",
                                        uploadDate: new Date(),
                                        type: isd,
                                        _id: "/_Runs/" + directorio + "/" + item + (isd ? "/" : ""),
                                        veneno: ""
                                    });
                                });
                            },
                            function(err, files) {
                                if (err) {
                                    return cb(err);
                                }
                                files && files.forEach(function(f) {
                                    result.result.push(front(f));
                                });
                                cb(null, files);
                            });
                    });
                }
            }

            function listVirtualFolder(cwd, userId, root, cb) {
                function procesar(err, folderP) {
                    if (err) return cb(err);
                    if (!folderP) {
                        return cb("Unknown folder");
                    }
                    File.find({
                        parent: folderP._id,
                        owner: userId
                    }, function(err, files) {
                        if (err) return cb(err);
                        //files.unshift(folderP);
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
                        cb(null, files);
                    });
                }

                File.findOne({
                    _id: cwd,
                    type: "dir"
                }, procesar);
            }

            router.post("/listar", isAuthenticated, function(req, res, next) {
                getRootFolder(req.user._id, function(err, idRaiz) {
                    var cwd = false,
                        root = false;
                    if (req.body.path) {
                        cwd = req.body.path.cwd;
                    }
                    var userId = req.user._id;
                    var result = {
                        result: []
                    };
                    if (!cwd) {
                        cwd = idRaiz;
                        root = true;
                    } else {
                        root = cwd === idRaiz || req.body.path.path === "/";
                    }

                    function cb(err, files) {
                        if (err) {
                            return res.send(result);
                        }
                        result.result = files;
                        res.send(result);
                    }

                    if (!root && cwd.indexOf("/") > -1) {
                        var p = cwd.split(path.sep).filter(function(elem) {
                            return elem !== "" && elem !== ".." && elem !== ".";
                        });
                        if (p.length < 2) {
                            listDagExeFolders(cb);
                        } else {
                            listDagExeFiles(path, p, userId, cb);
                        }
                    } else {
                        listVirtualFolder(cwd, userId, root, cb);
                    }
                });
            });
        };
