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

// TODO: Add a better error handling here
/*
Test this function: nodo = {configurado: ...}
 */
function nodeAClassAd(nodo, workloader) {
    var res = "";
    if (nodo.configurado) {
        var configuracion = nodo.configurado;
        var obj = {
            config: configuracion,
            nodo: nodo,
            dagdir: config.DAG_DIR
        };
        switch(workloader){
        case 1:
            res = config.JOB_TEMPLATE.openlava(obj);
            break;
        case 2:
            res = config.JOB_TEMPLATE.torque(obj);
            break;
        case 3:
            res = config.JOB_TEMPLATE.slurm(obj);
            break;
        }
    }
    return res;
}

function indiceNodo(ordenado, id, workloader) {
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

var enviarssh = function(i, cwd, workloader, cb) {
    var regexs = [/Job <(\d*)>.*<([a-zA-Z]*)>/g, /(\d*.*)/g, /Submitted batch job (\d*)/g, ];
    var comando,
        argumento,
        otros;
    var ssh = new SSH({
        host: 'openlava,torque,slurm'.split(",")[workloader - 1],
        port: '22',
        user: 'testuser',
        key: config.SSHKEY,
        baseDir: cwd
    }).on('error', function(err) {
        return cb(err);
    });
    var commands = ["condor_submit_dag", "bsub", "qsub", "sbatch"];
    if (workloader == 1 || workloader == 2) {
        comando = "cat " + i + " | " + commands[workloader];
    } else {
        comando = commands[workloader] + " " + i;
    }
    ssh.exec(comando, {
        out: function(stdout) {
            var regex = regexs[workloader - 1];
            var m = regex.exec(stdout);
            if (m && m.length > 1)
                return cb(null, m[1]);
            else
                return cb("Unknow error");
        },
        err: function(stderr) {
            return cb(stderr.message);
        }
    }).start(function(err, start) {
        if (err) {
            return cb(err);
        }
    });
};

var enviar = function(i, cwd, workloader, cb) {
    var regexs = [/Job <(\d*)>.*<([a-zA-Z]*)>/g, /(\d*).*/g, /Submitted batch job (\d*)/g, ];
    var comando,
        argumento;
    var otros = {
        cwd: cwd,
        timeout: 5000
    };
    if (workloader == 1 || workloader == 2) {
        var commands = ["bsub", "qsub"];
        comando = commands[workloader - 1] + " < " + i;
        ejecutar(comando, cb);
    } else if (workloader == 3) {
        comando = 'sbatch ' + i;
        ejecutar(comando, cb);
    }

    function ejecutar(comando, cb) {
        logger.info("Ejecutando", comando);
        var proc = exec(comando, function(error, stdout, stderr) {
            if (error) {
                return cb(error.message);
            }
            if (stderr) {
                return cb(stderr);
            }
            var regex = regexs[workloader - 1];
            var m = regex.exec(stdout);
            if (m && m.length > 1)
                cb(null, m[1]);
            else
                cb("Unknow error");
        });
        /*proc.on("error", function(err){
          cb(err);
        });*/
    }
};


// Get the jobs dependencies' names for a node
var getDependencies = function(edges, ordenado, item, workloader){
     var fromDeps = edges.filter(function(elem) {
         return (elem.target.id === item.id);
     });
     var deps = fromDeps.reduce(function(depend, o) {
         if (workloader === 3)
             depend.push(indiceNodo(ordenado, o.source.id, workloader));
         else if (workloader === 2) {
             /*if(o.source.configurado.times > 1){
              depend.push("afterokarray:"+ indiceNodo(ordenado, o.source.id,workloader));
              }else{*/
             depend.push(indiceNodo(ordenado, o.source.id, workloader));
             //}
         } else {
             depend.push("done(" + item.directorio + "_" + indiceNodo(ordenado, o.source.id, workloader) + ")");
         }
         return (depend);
     }, []);
    /*if (workloader === 2 && singleTorq.length > 0)
     deps.push("afterok:" + singleTorq.join(":"));*/
    return deps;
}

// edges, ordenado
// A function applied to each item in the array of nodes to produce the next step in the reduction.
// it assing the name of the node, it's dependencies' names, fill a template and submit using SSH or Fork/join
var submitNode = function(posDeps, item, edges, ordenado, callback) {
    item.nombre = (item.title + "_" + item.id).replace(/[^a-z0-9]/gi, '_').toLowerCase();
    item.dependencia = getDependencies(edges, ordenado, item, item.workloader);
    try{
        var nodeOut = nodeAClassAd(item, item.workloader);
    } catch(ex){
        callback("Error filling template");
    }
    var nombreArchivo = path.join(config.DAG_DIR, item.directorio, item.nombre + ".bash");

    controladorArchivos.crearArchivo(nombreArchivo, nodeOut, function(err, cb) {
        if (err) {
            return callback(err);
        }
        var sendToWLM = config.USESSH[item.workloader] ? enviarssh : enviar;
        return sendToWLM(nombreArchivo,
             path.join(config.DAG_DIR, item.directorio), item.workloader,
             function(err, jobid) {
                 if (err) {
                     return callback(err);
                 }
                 item.jobid = jobid;
                 callback(null, posDeps.push(item));
             });
    });
};

// This function receive two list of nodes and merge
// the information from one to another, more precise,
// data about the name and the id assigned by the workloadmanager
function mergeDagInfo(err, nodes, ordenado, cb) {
    if (err) {
        return cb(err);
    }
    if (nodes) {
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
    return cb(null, nodes);
}

var submitToLoadManagers = function(envio, nombreDir, workloader, cb) {
    var proyecto = envio.proyecto;
    var nodes = envio.nodes;
    if (!envio.edges) {
        envio.edges = [];
    }
    var edges = envio.edges;
    var ordenado = graphalg.KahnSAlgorithm(envio).orden;
    ordenado.map(function(nodo){
        nodo.directorio = nombreDir;
        nodo.workloader = workloader;
        return nodo;
    });
    async.reduce(ordenado, [], function(posDeps, item, callback){
        submitNode(posDeps, item, edges, ordenado, callback);
    }, function(err, ord){
        mergeDagInfo(err, nodes, ord, cb);
    });
};

exports.submitToLoadManagers = submitToLoadManagers;
exports.nodeAClassAd = nodeAClassAd;
