var express = require('express');
var async = require('async');
var tar = require('tar-fs');
var passport = require('passport');
var path = require('path');
var File = require('../models/file.js');
var DagExe = require('../models/dagExe.js');
var multer = require('multer');
var router = express.Router();
var fs = require('fs');
var config = require('../config');
var upload = multer({
    dest: config.UPLOAD_DIR
});
var isAuthenticated = require('../utils/login.js');

function fechaActual() {
    return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
}
// Asegurarse de que existe el nodo raíz
File.find({
    destination: "/",
    type: "dir"
}, function(err, folders) {
    if (err) return;

    if (!folders || folders.length === 0) {
        var f = new File({
            filename: "/",
            originalname: "/",
            destination: "/",
            uploadDate: fechaActual(),
            path: "/",
            type: "dir"
        });
        f.save(function(err, f) {
            if (err) return;
            idRaiz = f._id;
        // Crear carpeta "Share"
        });
    } else {
        idRaiz = folders[0]._id;
    }
});
//----------------------

router.get('/filemanager', isAuthenticated, function(req, res) {
    res.render('filemanager');
});

router.post('/crearArchivo', isAuthenticated, upload.single('file'), function(req, res, next) {
    var result = {
        success: true,
        error: null
    };
    var cwd = idRaiz;
    if (req.body.cwd) {
        cwd = req.body.cwd;
    }
    File.findOne({
        _id: cwd,
        type: "dir"
    }, function(err, folder) {
        if (err) {
            res.send(err); return;
        }
        if (typeof folder === 'undefined') {
            res.format({
                html: function() {
                    res.send(result);
                },
                json: function() {
                    res.json({
                        success: -1
                    });
                }
            });
            return;
        }
        var file = req.file;
        file.parent = folder._id;
        file.uploadDate = fechaActual();
        file.type = "file";
        file.owner = req.user._id;

        var f = new File(file);
        f.save(function(err, f) {
            if (err) {
                res.send(err); return;
            }
            res.format({
                html: function() {
                    res.send(result);
                },
                json: function() {
                    res.json({
                        success: f._id
                    });
                }
            });
        });
    });
});

// Bien
router.post('/crearArchivos', isAuthenticated, isAuthenticated, upload.any(), function(req, res, next) {
    var result = {
        result: {
            success: true,
            error: null
        }
    };
    var cwd = idRaiz;
    if (req.body.cwd) {
        cwd = req.body.cwd;
    }
    File.find({
        _id: cwd,
        type: "dir"
    }, function(err, folders) {
        if (err) {
            res.send(err); return;
        }
        if (!folders || folders.length === 0) {
            res.send(result);
            return;
        }
        var folderP = folders[0];
        var result = [],
            expectedLoadCount = req.files.length,
            loadCount = 0;
        req.files.forEach(function(file) {
            // if(path.extname(file.originalname) == "") {res.send(result); return;}
            // File.find({originalname:file.originalname},  function (err, folders) {
            file.parent = folderP._id;
            file.uploadDate = fechaActual();
            file.type = "file";
            file.owner = req.user._id;

            var f = new File(file);
            f.save(function(err, f) {
                if (err) {
                    res.send(err); return;
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
        });
    /*
    var archivos = req.files.map(function(file){
		file.parent = folderP._id;
		file.uploadDate = fechaActual();
		file.type = "file";
    });

    async.each(archivos, function(file, callback) {
			var f = new File(file);
			f.save(function (err, f) {
			  if (err){
				callback(err);
			  }
			  callback();
			});
		}, function(err){
			if (err) {res.send(result); return;};
			res.send(result);
		});
    */
    });
});

// Bien
router.post("/listar", isAuthenticated, function(req, res, next) {

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


// Bien
function renombrar(req, res) {
    var item = req.body.item.id;
    var newItemPath = req.body.newItemPath;
    var newName = path.basename(newItemPath);
    var result = {
        result: {
            success: true,
            error: null
        }
    };
    File.find({
        _id: item
    }, function(err, files) {
        if (err) return res.send(result);
        if (!files || files.length != 1) {
            res.send(result);
            return;
        }
        var file = files[0];
        file.originalname = newName;
        file.save(function(err, f) {
            if (err) return res.send(result);
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
// Bien
function mover(req, res) {
    var items = req.body.items;
    var newItemPath = req.body.newPath;
    var result = {
        result: {
            success: true,
            error: null
        }
    };

    var expectedLoadCount = items.length;
    var loadCount = 0;

    items.forEach(function(item) {
        // Encuentre el archivo
        File.find({
            _id: item.id
        }, function(err, files) {
            if (err) {
                return res.send(result);
            }
            if (!files || files.length != 1) {
                res.send(result);
                return;
            }
            var file = files[0];
            // Encuentre el directorio de destino
            File.find({
                _id: newItemPath,
                type: "dir"
            }, function(err, folders) {
                if (err) return res.send(result);
                if (!folders || folders.length === 0) {
                    res.send(result);
                    return;
                }
                var folderP = folders[0];
                file.parent = folderP._id;
                file.save(function(err, f) {
                    if (err) {
                        return res.send(result);
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
                }); /**/
            });

        });
    });
}

// OJO UTF8
function savefile(req, res) {
    var item = req.body.item.id;
    var content = req.body.content;
    var result = {
        result: {
            success: true,
            error: null
        }
    };

    File.find({
        _id: item,
        type: "file"
    }, function(err, files) {
        if (err) return res.send(result);
        if (!files || files.length != 1) {
            res.send(result);
            return;
        }
        var file = files[0];
        /*file.size = NN;
        file.save(function (err, f) {
		  if (err) return res.send(result);
		  console.log("Exito");
		  return res.send(result);
        });*/
        fs.writeFile(file.path, content, function(err) {
            if (err) {
                return res.send(result);
            }
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
// Bien
router.post("/editarArchivo", function(req, res, next) {
    var mode = req.body.action;
    if (mode === "rename") {
        renombrar(req, res);
    } else if (mode === "edit") {
        savefile(req, res);
    } else {
        mover(req, res);
    }
});

// Bien
router.get("/descargarArchivo", function(req, res, next) {
    var item = req.query.path;
    console.log(item);
    if (item.id)
        item = item.id;

    var result = {
        result: {
            success: false,
            error: ""
        }
    };
    console.log("000", item);
    if (item.indexOf("/") > -1) {
        var p = item.split(path.sep).filter(function(elem) {
            return elem !== "" && elem !== ".." && elem !== ".";
        });
        console.log("aaa", p);
        if (p.length > 1) {
            var directorio = path.join(config.DAG_DIR, p.slice(1).join(path.sep));
            console.log("bbb", directorio);
            fs.stat(directorio, function(err, stats) {
                if (err) {
                    console.log("bbb", err);
                    return;
                }
                res.download(directorio, path.basename(item));
            });
        }
    } else {
        console.log("D:");
        File.find({
            _id: item,
            type: "file"
        }, function(err, files) {
            if (err) return res.send(result);
            if (!files || files.length != 1) {
                result.error = "Archivo no encontrado";
                res.send(result);
                return;
            }
            var file = files[0];
            res.download(file.path, file.originalname);
        });
    }
});

// Bien
router.get("/descargarMultiple", function(req, res, next) {
    var items = req.query.items;
    var result = {
        result: {
            success: false,
            error: ""
        }
    };
    File.find({
        _id: {
            $in: items.map(function(o) {
                return o.id;
            })
        },
        type: "file"
    }, function(err, files) {
        if (err) {
            res.send(result); return;
        }
        if (!files) {
            result.error = "Archivos no encontrado";
            res.send(result);
            return;
        }
        res.setHeader('Content-disposition', 'attachment; filename=uchuva.tar');
        res.setHeader('Content-type', 'application/octet-stream');
        //res.setHeader('Content-Transfer-Encoding', 'binary');

        tar.pack(config.UPLOAD_DIR, {
            entries: files.map(function(o) {
                return o.filename;
            }),
            map: function(header) {
                header.name = files.filter(function(v) {
                    return header.name === v.filename; // Filter out the appropriate one
                })[0].originalname;
                return header;
            }
        }).pipe(res);
    });
});

// const zlib = require('zlib');

router.post("/eliminarArchivo", function(req, res, next) {
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

    //res.send(result);
    eliminarArchivos(items);
});

// Bien
router.post("/contenidoArchivo", function(req, res, next) {
    var item = req.body.item;
    if (req.body.item.id)
        item = req.body.item.id;
    var result = {
        result: {
            success: true,
            error: null
        }
    };

    File.find({
        _id: item,
        type: "file"
    }, function(err, files) {
        if (err) return res.send(result);
        if (!files || files.length != 1) {
            res.send(result);
            return;
        }
        var file = files[0];
        fs.readFile(file.path, 'utf8', function(err, data) {
            if (err) {
                return res.send("");
            }
            result.result = data;
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
});

// Bien
router.post("/crearCarpeta", isAuthenticated, function(req, res, next) {
    var cwd = idRaiz;
    var params = req.body;
    if (req.body.newPath) {
        params = req.body.newPath;
    }
    var nombre = path.basename(params.path);
    if (params.cwd)
        cwd = params.cwd;
    var result = {
        success: false,
        error: {}
    };

    File.find({
        _id: cwd,
        type: "dir"
    }, function(err, folders) {
        if (err) {
            return res.send(result);
        }
        if (!folders || folders.length === 0) {
            return res.send(result);
        }
        var carpetaPadre = folders[0];
        var f = new File({
            filename: nombre, //
            originalname: nombre, //
            size: "", //
            uploadDate: fechaActual(),
            project: "",
            node: "",
            parent: carpetaPadre._id,
            type: "dir",
            owner: req.user._id
        });
        f.save(function(err, f) {
            if (err) {
                return res.send(result);
            }
            result.success = true;
            result.error = undefined;
            res.format({
                html: function() {
                    res.send(result);
                },
                json: function() {
                    res.json({
                        success: 0,
                        id: f._id
                    });
                }
            });
        });
    });
});

module.exports = router;
