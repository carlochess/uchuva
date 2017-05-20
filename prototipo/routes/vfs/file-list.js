var express = require('express');
var async = require('async');
var path = require('path');
var DagExe = require('../../models/dagExe.js');
var File = require('../../models/file.js');
var logger = require('../../utils/logger.js');
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
            logger.error("Getting root folder" + err + ", user " + userId);
            return cb(err);
        }
        if(!folder){
            err = "Getting root folder, user " + userId;
            logger.error(err);
            return cb(err);
        }
        var idRaiz = folder._id;
        return cb(null, idRaiz);
    });
}

module.exports = function(app) {
    app.use('/', router);

  router.post("/buscar", isAuthenticated, function(req, res) {
        req.checkBody('filename', 'Invalid filename').notEmpty();
        var errors = req.validationErrors();
        if (errors) {
            var asStr = errors.map(function(e) {
                return e.msg;
            }).join(",");
            return res.send({
                code: 1,
                message: asStr
            });
        }
        var filename = req.body.filename;
        File.find({
            originalname: filename,
            owner: req.user._id
        }, function(err, files) {
          if (err){
            return res.send({
                code: 2,
                message: err + ""
            });
          }
            var archivos = [];
            if(files){
                files.forEach(function(f) {
                    archivos.push(front(f));
                });
            }
            return res.send({
                files: archivos
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
                cb(err);
            }
            if(!dags || dags.length === 0){
                return cb("No dags executions");
            }
            dags.unshift({
                originalname: "_Runs",
                size: "0",
                date: new Date(),
                type: "dir",
                _id: "/_Runs/",
                veneno: ""
            });
            dags = dags.map(function(f) {
                return front({
                    originalname: f.nombre,
                    size: "0",
                    uploadDate: f.date,
                    type: "dir",
                    _id: "/_Runs/" + f.nombre + "/",
                    veneno: ""
                });
            });
            cb(null, dags);
        });
    }

    function listDagExeFiles(path, p, userId, cb) {
        var directorio = p.slice(1).join(path.sep);
        DagExe.findOne({
            userid: userId,
            nombre: p[1]
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
                                uploadDate: stats.birthtime,
                                type: isd? "dir":"file",
                                _id: "/_Runs/" + directorio + "/" + item + (isd ? "/" : ""),
                                veneno: ""
                            });
                        });
                    },
                    function(err, files) {
                        if (err) {
                            return cb(err);
                        }
                        if(files){
                            files.unshift({
                                originalname: "_",
                                size: "0",
                                uploadDate: new Date(),
                                type: "dir",
                                _id: "/_Runs/",
                                veneno: ""
                            });
                            files = files.map(function(f) {
                                return front(f);
                            });
                        }
                        cb(null, files);
                    }
                );
            });
        });
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
                files = files.map(function(f) {
                    return front(f);
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
            var result = {
                result: []
            };
            if(err){
                return res.send(result);
            }
            var cwd = false,
                root = false;
            if (req.body.path) {
                cwd = req.body.path.cwd;
            }
            var userId = req.user._id;
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
                    listDagExeFolders(userId,cb);
                } else {
                    listDagExeFiles(path, p, userId, cb);
                }
            } else {
                listVirtualFolder(cwd, userId, root, cb);
            }
        });
    });
};
