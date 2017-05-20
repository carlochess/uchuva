var path = require('path');
var logger = require('../../utils/logger.js');
var controladorArchivos = require('../../utils/file.js');
var File = require('../../models/file.js');
var mongoose = require('mongoose');
var async = require('async');
var fs = require('fs');
var config = require('../../config.js');

var noEsta = function(obj, arr) {
    for (var i = 0; i < arr.length; i++) {
        if (obj.id == arr[i].id) {
            return false;
        }
    }
    return true;
};

function validarArchivos(items, userId, cb) {
    try {
      var arrIds = items.map(function(o) {
         return mongoose.Types.ObjectId(o.id);
      });
    }catch(ex){
      return cb(ex);
    }
    File.find({
        $and: [{
            _id: {
              $in: arrIds
            }
          },{
            $or: [{
              owner : userId
            },{
              public : true
            }]
          }
        ]
    }, function(err, files) {
        if (err) {
            logger.error("No encontrados");
            cb(err);
            return;
        }
        cb(null, files.map(function(h) {
            h.plusp = "";
            return h;
        }));
    });
}

function moverArchivos(destFolder, f, cb) {
    var ficheros = f;
    async.whilst(function() {
        return ficheros.length !== 0;
    }, function(callback) {
        var fichero = ficheros.shift();
        if (fichero.type !== "file") {
            fs.mkdir(path.join(destFolder, fichero.plusp, fichero.originalname), function(err, carpeta) {
                if (err) {
                    callback(err);
                    return;
                }
                File.find({
                    parent: fichero._id.toString()
                }, function(err, hijos) {
                    if (err) {
                        callback(err);
                        return;
                    }
                    if (hijos) {
                        ficheros = ficheros.concat(hijos.map(function(h) {
                            h.plusp = path.join(fichero.plusp, fichero.originalname);
                            return h;
                        }));
                    }
                    callback();
                });
            });
        } else if (fichero.type === "file") {
            controladorArchivos.copiarArchivo(fichero.path,
                path.join(destFolder, fichero.plusp,
                    fichero.originalname), function(err) {
                    if (err) {
                        callback(err);
                        return;
                    }
                    callback();
                });
        }
    }, function(err) {
        cb(err);
    });
}

function trasteo(envio, nombreDir, userid,  cb) {
    var ficheros = [];
    if (envio.nodes) {
        envio.nodes.forEach(function(nodo) {
            if (nodo.configurado && nodo.configurado.file) {
                nodo.configurado.file.map(function(o) {
                    if (o.entrada && o.id &&
                        (o.type === 'file'|| o.type === 'dir')) {
                        if (noEsta(o, ficheros)) {
                            ficheros.push(o);
                        }
                    }
                });
            }
        });
    }
    validarArchivos(ficheros, userid, function(err, ficherosbd) {
        if (err) {
            return cb(err);
        }
        logger.info(ficherosbd,{ funcion: 'trasteo'});
        moverArchivos(path.join(config.DAG_DIR, nombreDir), ficherosbd, function() {
            if (err) {
                return cb(err);
            }
            return cb();
        });
    });
}

exports.trasteo = trasteo;
