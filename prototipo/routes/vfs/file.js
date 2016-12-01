var express = require('express');
var async = require('async');
var path = require('path');
var File = require('../../models/file.js');
var multer = require('multer');
var router = express.Router();
var fs = require('fs');
var config = require('../../config');
var logger = require('../../utils/logger.js');
var upload = multer({
    dest: config.UPLOAD_DIR
});
var isAuthenticated = require('../../utils/login.js');

function fechaActual() {
    return new Date()
        .toISOString()
        .replace(/T/, ' ')
        .replace(/\..+/, '');
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

    router.get('/filemanager', isAuthenticated, function(req, res) {
        res.render('filemanager');
    });


    function crearArchivo(cwd, file, userId, cb) {
        File.findOne({
            _id: cwd,
            type: "dir",
            owner: userId
        }, function(err, folder) {
            if (err || !folder) {
                cb(err);
                return;
            }
            file.parent = folder._id;
            file.uploadDate = fechaActual();
            file.type = "file";
            file.owner = userId;

            var f = new File(file);
            f.save(function(err, f) {
                if (err) {
                    cb(err);
                    return;
                }
                cb(null, f._id);
            });
        });
    }

    router.post('/crearArchivo',
        isAuthenticated,
        upload.single('file'),
        function(req, res, next) {
            getRootFolder(req.user._id, function(err, cwd) {
                req.checkBody('cwd', 'Invalid cwd').optional().isMongoId();
                var errors = req.validationErrors();
                if (errors) {
                    var asStr = errors.map(function(e) {
                        return e.msg;
                    }).join(",");
                    res.send(errors);
                    return;
                }
                if (req.body.cwd) {
                    cwd = req.body.cwd;
                }
                var file = req.file;
                var userId = req.user._id;

                crearArchivo(cwd, file, userId, function(err, fileId) {
                    if (err) {
                        logger.error("/crearArchivo " + err + ", user: " + userId);
                        res.send(err);
                        return;
                    }
                    res.format({
                        html: function() {
                            res.send(result);
                        },
                        json: function() {
                            res.json({
                                success: fileId
                            });
                        }
                    });
                });
            });
        });

    function crearArchivos(cwd, files, userId, cb) {
        File.findOne({
            _id: cwd,
            type: "dir",
            owner: userId
        }, function(err, folder) {
            if (err || !folder) {
                cb(err);
                return;
            }
            async.each(files, function(file, scb) {
                file.parent = folder._id;
                file.uploadDate = fechaActual();
                file.type = "file";
                file.owner = userId;
                var f = new File(file);
                f.save(function(err, f) {
                    if (err) {
                        scb(err);
                        return;
                    }
                    scb();
                });
            }, cb);
        });
    }

    router.post('/crearArchivos',
        isAuthenticated,
        upload.any(),
        function(req, res, next) {
            getRootFolder(req.user._id, function(err, cwd) {
                req.checkBody('cwd', 'Invalid cwd').optional().isMongoId();
                var errors = req.validationErrors();
                if (errors) {
                    var asStr = errors.map(function(e) {
                        return e.msg;
                    }).join(",");
                    return res.send(asStr);
                }
                if (req.body.cwd) {
                    cwd = req.body.cwd;
                }
                var files = req.files;
                var userId = req.user._id;
                crearArchivos(cwd, files, userId, function(err) {
                    if (err) {
                        logger.error("/crearArchivos " + err + ", user: " + userId);
                        res.send(err);
                        return;
                    }
                    res.send({
                        code: 0
                    });
                });
            });
        });

    function contenidoArchivo(archivo, userId, cb) {
        File.findOne({
            _id: archivo,
            type: "file",
            owner: userId
        }, function(err, file) {
            if (err || !file) return cb(err);
            fs.readFile(file.path, 'utf8', function(err, data) {
                if (err) {
                    return cb(err);
                }
                cb(null, data);
            });
        });
    }

    router.post("/contenidoArchivo", isAuthenticated, function(req, res, next) {
        req.checkBody('item.id', 'Invalid cwd').notEmpty().isMongoId();
        var errors = req.validationErrors();
        if (errors) {
            var asStr = errors.map(function(e) {
                return e.msg;
            }).join(",");
            return res.send(asStr);
        }
        var item = req.body.item;
        if (req.body.item.id)
            item = req.body.item.id;
        var userId = req.user._id;
        contenidoArchivo(item, userId, function(err, data) {
            if (err) {
                logger.error("/contenidoArchivo " + err + ", user: " + userId);
                return res.send(err);
            }
            res.send({
                result: data
            });
        });
    });

    function crearCarpeta(cwd, nombre, userId, cb) {
        File.findOne({
            _id: cwd,
            type: "dir",
            owner: userId
        }, function(err, folder) {
            if (err || !folder) {
                return res.send(result);
            }
            var f = new File({
                filename: nombre, //
                originalname: nombre, //
                size: "", //
                uploadDate: fechaActual(),
                project: "",
                node: "",
                parent: folder._id,
                type: "dir",
                owner: userId
            });
            f.save(function(err, f) {
                if (err) {
                    return cb(result);
                }
                cb(null, f._id);
            });
        });
    }

    router.post("/crearCarpeta", isAuthenticated, function(req, res, next) {
        getRootFolder(req.user._id, function(err, cwd) {
            if (req.body.newPath) {
                req.body = req.body.newPath;
            }
            req.checkBody('cwd', 'Invalid cwd').optional().isMongoId();
            req.checkBody('path', 'Invalid path').notEmpty().isAscii();
            var errors = req.validationErrors();
            if (errors) {
                var asStr = errors.map(function(e) {
                    return e.msg;
                }).join(",");
                return res.send(asStr);
            }
            var nombre = path.basename(req.body.path);
            if (req.body.cwd)
                cwd = req.body.cwd;
            var userId = req.user._id;

            crearCarpeta(cwd, nombre, userId, function(err, folderId) {
                if (err) {
                    logger.error("/crearCarpeta " + err + ", user: " + userId);
                    return res.send(result);
                }
                res.send({
                    success: 0,
                    id: folderId
                });
            });
        });
    });
};
