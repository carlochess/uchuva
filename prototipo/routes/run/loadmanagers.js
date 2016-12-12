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
        var obj = {
            config: configuracion,
            nodo: nodo,
            dagdir: dagDir
        };
        if (cm == 1) {
            res = config.JOB_TEMPLATE.openlava(obj);
        } else if (cm == 2) {
            res = config.JOB_TEMPLATE.torque(obj);
        } else if (cm == 3) {
            res = config.JOB_TEMPLATE.slurm(obj);
        }
    }
    return res;
}

function indiceNodo(ordenado, id,workloader) {
    var i = 0;
    for (; i < ordenado.length; i++) {
        if (ordenado[i].id === id) {
            if (workloader === 1) {
                return ordenado[i].nombre;
            }
            return ordenado[i].jobid;
        }
    }
    return -1;
}

var enviarssh = function(i, cwd, workloader,cb) {
    logger.info("enviando");
    var regexs = [/Job <(\d*)>.*<([a-zA-Z]*)>/g, /(\d*.[a-zA-Z]*)/g, /Submitted batch job (\d*)/g,];
    var comando,
        argumento,
        otros;
    var ssh = new SSH({
        host: 'openlava,torque,slurm'.split(",")[workloader - 1],
        port: '22',
        user: 'testuser',
        key: config.SSHKEY,
        baseDir: cwd,
    }).on('error', function(err){
      return cb(err);
    });
    var commands = ["condor_submit_dag", "bsub", "qsub", "sbatch"];
    if (workloader == 1 || workloader == 2) {
        comando = "cat " + i + " | " + commands[workloader];
    } else {
        comando = commands[workloader] +" "+ i;
    }
    ssh.exec(comando, {
        out: function(stdout) {
            var regex = regexs[workloader - 1];
            var m = regex.exec(stdout);
            if(m && m.length > 1)
              return cb(null, m[1]);
            else
              return cb("Unknow error");
        },
        err: function(stderr) {
            return cb(stderr);
        }
    }).start(function(err, start){
      if(err){
        return cb(err);
      }
    });
};

var enviar = function(i, cwd, workloader,cb) {
    var regexs = [/Job <(\d*)>.*<([a-zA-Z]*)>/g, /(\d*).*/g, /Submitted batch job (\d*)/g,];
    var comando,
        argumento;
    var otros = {
      cwd: cwd,
      timeout: 5000,
    };
    if (workloader == 1 || workloader == 2) {
        var commands = ["bsub", "qsub"];
        comando = commands[workloader - 1]+" < "+ i;
        ejecutar(comando, cb);
    } else if (workloader == 3) {
        comando = 'sbatch ' + i;
        ejecutar(comando, cb);
    }
    function ejecutar(comando/*, otros*/, cb) {
        logger.info("Ejecutando", comando);
        var proc = exec(comando/*, otros*/, function(error, stdout, stderr) {
            if (error) {
                return cb(error);
            }
            if (stderr) {
                return cb(stderr);
            }
            var regex = regexs[workloader - 1];
            var m = regex.exec(stdout);
            if(m && m.length > 1)
              cb(null, m[1]);
            else
              cb("Unknow error");
        });
        /*proc.on("error", function(err){
          cb(err);
        });*/
    }
};


var submitToLoadManagers = function(envio, nombreDir,workloader,cbbbb) {
    var proyecto = envio.proyecto;
    var nodes = envio.nodes;
    if (!envio.edges) {
        envio.edges = [];
    }
    var ordenado = graphalg.KahnSAlgorithm(envio).orden;
    notificarBlaBla();
    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
    function notificarBlaBla() {
        async.reduce(ordenado, 0, function(i, item, callback) {
            var deps = envio.edges.filter(function(elem) {
                return (elem.target.id === ordenado[i].id);
            }).map(function(o) {
                if (workloader != 1)
                    return indiceNodo(ordenado, o.source.id,workloader);
                return "done(" + nombreDir + "_" + indiceNodo(ordenado, o.source.id,workloader) + ")";
            });
            ordenado[i].nombre = (ordenado[i].title + "_" + ordenado[i].id).replace(/[^a-z0-9]/gi, '_').toLowerCase();
            ordenado[i].dependencia = deps;
            ordenado[i].directorio = nombreDir;
            console.dir(ordenado[i]);
            var nodeOut = nodeAClassAd(ordenado[i], config.DAG_DIR, [], [], workloader);
            console.log(nodeOut);
            controladorArchivos.crearArchivo(path.join(config.DAG_DIR, nombreDir, ordenado[i].nombre + ".bash"), nodeOut, function(err, cb) {
                if (err) {
                    return callback(err, i);
                }
                enviarssh(path.join(config.DAG_DIR, nombreDir, ordenado[i].nombre + ".bash"),
                    path.join(config.DAG_DIR, nombreDir),workloader,
                    function(err, jobid) {
                        if (err) {
                            return callback(err, i + 1);
                        }
                        ordenado[i].jobid = jobid;
                        callback(null, i + 1);
                    }
                );
            });
        },
            function(err, result) {
                if (err) {
                    cbbbb(err);
                    return;
                }
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
            if(nodes){
              nodes.map(function(nodo) {
                  for (var i = 0; i < ordenado.length; i++) {
                      if (ordenado[i].id == nodo.id) {
                          nodo.jobnombre = ordenado[i].nombre;
                          nodo.jobid = ordenado[i].jobid;
                          return nodo;
                      }
                  }
                  return nodo;
              });
            }
            cbbbb(null, nodes);
        }
    }
};
exports.submitToLoadManagers = submitToLoadManagers;
