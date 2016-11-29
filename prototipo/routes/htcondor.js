var HTCondor = require("soap-htcondor");
var logger = require('../utils/logger.js');
var controladorArchivos = require('../utils/file.js');
var async = require('async');
var config = require('../config.js');
var fs = require('fs');
var path = require('path');

function nodeAClassAd(nodo, dagDir, filese, filess, cm) {
    var res = "";
    if (nodo.configurado) {
        var configuracion = nodo.configurado;
        configuracion.queue = configuracion.queue || 1;
        configuracion.universe = configuracion.universe || "vanilla";
        res = config.JOB_TEMPLATE.htcondor({
            config: configuracion,
            nodoNombre: nodo.nombre,
            filese: filese,
            filess: filess
        });
    }
    return res;
}

function submitJobs(dagl, cb) {
    var htcondor = new HTCondor({
        url: config.CONDOR_URL,
        wsdl: path.join(__dirname, "..", "utils", "wsdl", "condorSchedd.wsdl")
    });
    var dagJob = {
        dagLocation: dagl,
        owner: config.CONDOR_JOB_OWNER
    };
    htcondor.createSchedduler(function(err, schedd) {
        if (err) {
            logger.info("Error al crear Schedd", err);
            cb(err);
            return;
        }
        schedd.createDagJob(dagJob, function(err, job) {
            /*if(err){
              logger.info("Error al enviar dag");
              cb(err);
              return;
            }*/
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
        var nodeOut = nodeAClassAd(nodo, nombre, nombresEntrada, nombresSalida, config.BMANAGER);
        dagManContent += "Job " + nombre + " " + nombre + ".submit" + "\r\n";
        //return nodo;
        controladorArchivos.crearArchivo(path.join(config.DAG_DIR, nombreDir, nombre + ".submit"), nodeOut, function(err) {
            if (err) {
                callback(err);
                return;
            }
            callback();
        });
    }, function(err) {
        if (err) {
            cb(err);
            return;
        }
        dagfile();
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
            submitJobs(path.join(config.DAG_DIR, nombreDir, "dagman.dag"), cb);
        });
    }
};
exports.enviarHTC = enviarHTC;
