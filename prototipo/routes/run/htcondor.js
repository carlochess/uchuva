var HTCondor = require("soap-htcondor");
var async = require('async');
var fs = require('fs');
var path = require('path');
var logger = console; //require('../../utils/logger.js');
var controladorArchivos = require('../../utils/file.js');
var config = require('../../config.js');
var exec = require('child_process').exec;
var SSH = require('simple-ssh');

function nodeAClassAd(nodo, filese, filess, cm) {
    var res = "";
    if (nodo.configurado) {
        var configuracion = nodo.configurado;
        configuracion.queue = configuracion.queue || 1;
        configuracion.universe = configuracion.useDocker? "docker" : configuracion.universe || "vanilla";
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
    var regexs = [/Job <(\d*)>.*<([a-zA-Z]*)>/g];
    var ssh = new SSH({
        host: 'htcondor',
        port: '22',
        user: 'testuser',
        key: config.SSHKEY,
        baseDir: cwd
    }).on('error', function(err){
      return cb(err);
    });
    var comando = "condor_submit_dag" +" "+ dagfile;
    ssh.exec(comando, {
        out: function(stdout) {
            /*var regex = regexs[workloader - 1];
            var m = regex.exec(stdout);
            if(m && m.length > 1)*/
              console.log(stdout)
              return cb(null/*, m[1]*/);/*
            else
              return cb("Unknow error");*/
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


var enviar = function(dagfile, cwd,cb) {
    var regexs = [/Job <(\d*)>.*<([a-zA-Z]*)>/g];
    var otros = {
      cwd: cwd,
      timeout: 5000
    };
    var comando = 'condor_submit_dag ' + dagfile;
    ejecutar(comando, cb);
    function ejecutar(comando/*, otros*/, cb) {
        logger.info("Ejecutando", comando);
        var proc = exec(comando , otros, function(error, stdout, stderr) {
            if (error) {
                return cb(error.message);
            }
            if (stderr) {
                return cb(stderr);
            }
            /*var regex = regexs[workloader - 1];
            var m = regex.exec(stdout);
            if(m && m.length > 1)*/
              cb(null/*, m[1]*/);/*
            else
              cb("Unknow error");*/
        });
        proc.on("error", function(err){
          cb(err);
        });
        proc.on('close', function(code) { console.log("Return code", code) });
    }
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
        var nodeOut = nodeAClassAd(nodo, nombre, nombresEntrada, nombresSalida, config.BMANAGER);
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
