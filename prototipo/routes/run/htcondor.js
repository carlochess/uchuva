var HTCondor = require("soap-htcondor");
var async = require('async');
var fs = require('fs');
var path = require('path');
var logger = console; //require('../../utils/logger.js');
var controladorArchivos = require('../../utils/file.js');
var config = require('../../config.js');
var forkexec = require('./forkexec.js');

function nodeAClassAd(nodo, filese, filess, cm) {
    var res = "";
    if (nodo.configurado) {
        var configuracion = nodo.configurado;
        configuracion.queue = configuracion.queue || 1;
        configuracion.universe = configuracion.useDocker === "true" ? "docker" : configuracion.universe || "vanilla";
        res = config.JOB_TEMPLATE.htcondor({
            config: configuracion,
            nodoNombre: nodo.nombre,
            filese: filese,
            filess: filess
        });
    }
    return res;
}

var enviarssh = function( dagfile, cwd,cb) {
    logger.info("enviando");
    var otro = {
        host: config.SSHHOSTS[0],
        port: config.SSHPORTS[0],
        user: config.SSHUSERS[0],
        key: config.SSHKEY,
        baseDir: cwd
    };
    var comando = "condor_submit_dag" +" "+ dagfile;
    forkexec.enviarssh(comando, otro, function(err, log){
      return cb(err);
    });
};

var enviar = function(dagfile, cwd,cb) {
    var otros = {
      cwd: cwd,
      timeout: 5000
    };
    var comando = 'condor_submit_dag ' + dagfile;
    forkexec.enviar(comando, otros, function(err, log){
      return cb(err);
    });
};

function submitJobs(dagl, cb) {
    var htcondor = new HTCondor({
        url: config.CONDOR_URL,
        wsdl: path.join(__dirname, "..","..", "utils", "wsdl", "condorSchedd.wsdl")
    });
    var dagJob = {
        dagLocation: dagl,
        owner: config.CONDOR_JOB_OWNER
    };
    htcondor.createSchedduler(function(err, schedd) {
        if (err) {
            logger.info("Error al crear Schedd", err);
            return cb(err);
        }
        schedd.createDagJob(dagJob, function(err, job) {
            if(err){
              logger.info("Error al enviar dag");
              return cb(err);
            }
            logger.info("Enviado a htcondor");
            cb(null, null);
        });
    });
}

var enviarHTC = function(envio, nombreDir, cb) {
    var nodes = envio.nodes;
    if (!envio.edges) {
        envio.edges = [];
    }
    var edges = envio.edges;

    var noEsta = function(obj, arr) {
        for (var i = 0; i < arr.length; i++) {
            if (obj.id == arr[i].id) {
                return false;
            }
        }
        return true;
    };

    var dagManContent = "";
    async.each(nodes, function(nodo, callback) {
      var nombresEntrada = [];
      var nombresSalida = [];
      if (nodo.configurado && nodo.configurado.file) {
          nodo.configurado.file.map(function(o) {
              if (o.entrada == "true") {
                  nombresEntrada.push(o.filename);
                } else {
                  nombresSalida.push(o.filename);
                }
            });
        }
      var nombre = (nodo.title + "_" + nodo.id).replace(/[^a-z0-9]/gi, '_').toLowerCase();
      nodo.nombre = nombre;
      try{
        var nodeOut = nodeAClassAd(nodo, nombresEntrada, nombresSalida, config.BMANAGER);
      }catch(ex){
        return callback(ex);
      }
      dagManContent += "Job " + nombre + " " + nombre + ".submit" + "\r\n";
      controladorArchivos.crearArchivo(path.join(config.DAG_DIR, nombreDir, nombre + ".submit"), nodeOut, function(err) {
        if (err) {
          callback(err);
          return;
        }
        callback();
      });
    }, function(err) {
      if (err) {
        return cb(err);
      }
      return dagfile();
    });

    function dagfile() {
        function indiceNodo(id) {
            var i = 0;
            for (; i < nodes.length; i++) {
                if (nodes[i].id === id) {
                    return i;
                }
            }
            return -1;
        }
        // Dagman ----------------------------------------------------
        edges && edges.forEach(function(relacion) {

            var indexNodoParent = indiceNodo(relacion.source.id);
            var indexNodoChildren = indiceNodo(relacion.target.id);

            var nodoParent = nodes[indexNodoParent];
            var nodoChild = nodes[indexNodoChildren];
            var parent = (nodoParent.title + "_" + nodoParent.id).replace(/[^a-z0-9]/gi, '_').toLowerCase();
            var child = (nodoChild.title + "_" + nodoChild.id).replace(/[^a-z0-9]/gi, '_').toLowerCase();
            dagManContent += "PARENT " + parent + " CHILD " + child + "\r\n";
        });
        dagManContent += "NODE_STATUS_FILE status\r\n";
        controladorArchivos.crearArchivo(path.join(config.DAG_DIR, nombreDir, "dagman.dag"), dagManContent, function(err) {
            if (err) {
                cb(err);
                return;
            }
          if(config.USESOAP){
            submitJobs(path.join(config.DAG_DIR, nombreDir, "dagman.dag"), cb);
          }
          else if (config.USESSH[0]){
            enviarssh(path.join(config.DAG_DIR, nombreDir, "dagman.dag"),
                    path.join(config.DAG_DIR, nombreDir),
                      cb);
          }
          else {
            enviar(path.join(config.DAG_DIR, nombreDir, "dagman.dag"),
                    path.join(config.DAG_DIR, nombreDir),
                   cb);
          }
        });
    }
};
exports.enviarHTC = enviarHTC;
exports.nodeAClassAd = nodeAClassAd;
