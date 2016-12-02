var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
var SSH = require('simple-ssh');
var async = require('async');
var logger = require('../../utils/logger.js');
var graphalg = require('../../utils/graphalg.js');
var controladorArchivos = require('../../utils/file.js');
var config = require('../../config.js');
var DagExe = require('../../models/dagExe.js');

function nodeAClassAd(nodo, dagDir, filese, filess, cm) {
    var res = "";
    if (nodo.configurado) {
        var configuracion = nodo.configurado;
        if (cm == 1) {
            res = config.JOB_TEMPLATE.openlava({
                config: configuracion,
                nodo: nodo,
                dagdir: dagDir
            });
        } else if (cm == 2) {
            res = config.JOB_TEMPLATE.torque({
                config: configuracion,
                nodo: nodo,
                dagdir: dagDir
            });
        } else if (cm == 3) {
            res = config.JOB_TEMPLATE.slurm({
                config: configuracion,
                nodo: nodo,
                dagdir: dagDir
            });
        }
    }
    return res;
}

function indiceNodo(ordenado, id) {
    var i = 0;
    for (; i < ordenado.length; i++) {
        if (ordenado[i].id === id) {
            if (config.BMANAGER == 1) {
                return ordenado[i].nombre;
            }
            return ordenado[i].jobid;
        }
    }
    return -1;
}

var enviarssh = function(i, cwd, cb) {
    logger.info("enviando");
    var regexs = [/Job <(\d*)>.*<([a-zA-Z]*)>/g, /(\d*.[a-zA-Z]*)/g, /Submitted batch job (\d*)/g,];
    var comando,
        argumento,
        otros;
    var ssh = new SSH({
        host: 'openlava,torque,slurm'.split(",")[config.BMANAGER - 1],
        port: '22',
        user: 'testuser',
        key: config.SSHKEY,
        baseDir: cwd,
    }).on('error', function(err){
      cb(err);
    });
    var commands = ["condor_submit_dag", "bsub", "qsub", "sbatch"];
    if (config.BMANAGER == 1 || config.BMANAGER == 2) {
        comando = "cat " + i + " | " + commands[config.BMANAGER];
        ssh.exec(comando, {
            out: function(stdout) {
                var regex = regexs[config.BMANAGER - 1];
                var m = regex.exec(stdout);
                if(m && m.length > 1)
                  cb(null, m[1]);
                else
                  cb("Unknow error");
            },
            err: function(stderr) {
                cb(stderr);
            }
        }).start();
    } else {
        comando = commands[config.BMANAGER - 1] + i;
        ssh.exec(comando, {
            out: function(stdout) {
                var regex = regexs[config.BMANAGER - 1];
                var m = regex.exec(stdout);
                if(m && m.length > 1)
                  cb(null, m[1]);
                else
                  cb("Unknow error");
            },
            err: function(stderr) {
                cb(stderr);
            },
        }).start();
    }
};

var enviar = function(i, cwd, cb) {
    var regexs = [/Job <(\d*)>.*<([a-zA-Z]*)>/g, /(\d*).*/g, /Submitted batch job (\d*)/g,];
    var comando,
        argumento,
        otros;

    if (config.BMANAGER == 1 || config.BMANAGER == 2) {
        logger.info("Termine de leer");
        var commands = ["bsub", "qsub"];
        comando = "cat " + i + " | " + commands[config.BMANAGER - 1];
        otros = {
            cwd: cwd,
            timeout: 5,
        };
        ejecutar(comando, otros, cb);
    //});
    } else if (config.BMANAGER == 3) {
        comando = 'sbatch ' + i;
        otros = {
            cwd: cwd,
            timeout: 5,
        };
        ejecutar(comando, otros, cb);
    }
    function ejecutar(comando, otros, cb) {
        logger.info("Ejecutando", comando);
        exec(comando, otros, function(error, stdout, stderr) {
            if (error) {
                cb(error);
                return;
            }
            if (stderr) {
                cb(stderr);
                return;
            }
            var regex = regexs[config.BMANAGER - 1];
            var m = regex.exec(stdout);
            if(m && m.length > 1)
              cb(null, m[1]);
            else
              cb("Unknow error");
        });
    }
};


var submitToLoadManagers = function(envio, nombreDir, cbbbb) {
    var proyecto = envio.proyecto;
    var nodes = envio.nodes;
    if (!envio.edges) {
        envio.edges = [];
    }
    var ordenado = graphalg.KahnSAlgorithm(envio).orden;
    logger.info("ordenados");
    notificarBlaBla();
    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
    function notificarBlaBla() {
        async.reduce(ordenado, 0, function(i, item, callback) {
            var deps = envio.edges.filter(function(elem) {
                return (elem.target.id === ordenado[i].id);
            }).map(function(o) {
                if (config.BMANAGER != 1)
                    return indiceNodo(ordenado, o.source.id);
                return "done(" + nombreDir + "_" + indiceNodo(ordenado, o.source.id) + ")";
            });
            ordenado[i].nombre = (ordenado[i].title + "_" + ordenado[i].id).replace(/[^a-z0-9]/gi, '_').toLowerCase();
            ordenado[i].dependencia = deps;
            ordenado[i].directorio = nombreDir;
            var nodeOut = nodeAClassAd(ordenado[i], config.DAG_DIR, [], [], config.BMANAGER);
            logger.info("creando archivo");
            controladorArchivos.crearArchivo(path.join(config.DAG_DIR, nombreDir, ordenado[i].nombre + ".bash"), nodeOut, function(err, cb) {
                if (err) {
                    logger.info("<->".err);
                    callback(err, i);
                    return;
                }
                logger.info("Creado");
                enviarssh(path.join(config.DAG_DIR, nombreDir, ordenado[i].nombre + ".bash"),
                    path.join(config.DAG_DIR, nombreDir),
                    function(err, jobid) {
                        if (err) {
                            logger.info(err);
                            callback(err, i + 1);
                            return;
                        }
                        logger.info(jobid);
                        ordenado[i].jobid = jobid;
                        callback(null, i + 1);
                    }
                );
            });
        },
            function(err, result) {
                if (err) {
                    logger.info("Archivos no generados");
                    cbbbb(err);
                    return;
                }
                logger.info("Archivos generados");
                bd(null, cbbbb);
            });
        //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
        function bd(err, cbbbb) {
            if (err) {
                logger.info(err);
                cbbbb(err);
                return;
            }
            // merge entre los ordenados y los normales
            nodes && nodes.map(function(nodo) {
                for (var i = 0; i < ordenado.length; i++) {
                    if (ordenado[i].id == nodo.id) {
                        nodo.jobnombre = ordenado[i].nombre;
                        nodo.jobid = ordenado[i].jobid;
                        return nodo;
                    }
                }
                return nodo;
            });
            logger.info("regresando a casa");
            cbbbb(null, nodes);
        }
    }
};
exports.submitToLoadManagers = submitToLoadManagers;
