var fs = require('fs');
var express = require('express');
var passport = require('passport');
var soap = require('soap');
var path = require('path');
var mongoose = require('mongoose');
var datos = require("./moverdatos");
var htcondor = require("./htcondor");
var loadmanagers = require("./loadmanagers");
var logger = require('../../utils/logger.js');
var controladorArchivos = require('../../utils/file.js');
var config = require('../../config.js');
var isAuthenticated = require('../../utils/login.js');
var DagExe = require('../../models/dagExe.js');
var router = express.Router();
var amqp = require('amqplib/callback_api');

module.exports = function(app) {
    app.use('/', router);

    router.post('/run', isAuthenticated, function(req, res) {
        if (req.body.body)
            req.body = req.body.body;

        req.checkBody('proyecto', 'Invalid project id').notEmpty().isMongoId();
        req.checkBody('nodes', 'Invalid nodes').optional().isArrayOfNodes();
        req.checkBody('edges', 'Invalid edges').optional().isArrayOfEdges();
        //req.checkBody('imagen', 'Invalid image').optional().isAlphanumeric();
        req.checkBody('workloader', 'Invalid workloader').optional().isAlphanumeric();

        var errors = req.validationErrors();
        if (errors) {
            var asStr = errors.map(function(e) {
                return e.msg;
            }).join(",");
            res.send({
                error: 1,
                message: asStr
            });
            return;
        }

        var envio = req.body;
        var proyecto = envio.proyecto;
        var workloader = "htcondor,openlava,torque,slurm".split(",").indexOf(envio.workloader);
        workloader = (workloader == -1 ? 0 : workloader);

        controladorArchivos.crearDirectorio(config.DAG_DIR, function(err, nombreDir) {
            if (err) {
                logger.error("/run Error creando carpeta ejecucion");
                res.send({
                    error: 2,
                    message: "Error creando carpeta"
                });
                return;
            }

            if (config.USEQUEUE) {
                notificarBlaBla(null, null);
            } else {
                datos.trasteo(envio, nombreDir, function(err) {
                    if (err) {
                        logger.error("/run Moviendo los ficheros a " + nombreDir);
                        res.send({
                            error: 3,
                            message: "Error trasteo archivos"
                        });
                        return;
                    }
                    if (workloader === 0)
                        htcondor.enviarHTC(envio, nombreDir, notificarBlaBla);
                    else
                        loadmanagers.submitToLoadManagers(envio, nombreDir, workloader, notificarBlaBla);
                });
            }

            function notificarBlaBla(err, nodes) {
                if (err) {
                    logger.error("/run ", err);
                    res.send({
                        error: 4,
                        message: err
                    });
                    return;
                }
              logger.info("Guardando");
                var dag = new DagExe({
                    nombre: nombreDir,
                    descripcion: "[Editar]",
                    proyecto: envio.proyecto,
                    nodes: nodes || envio.nodes,
                    edges: envio.edges,
                    userid: req.user._id,
                    ejecuciones: [],
                    imagen: envio.imagen,
                    tipo: workloader
                });
                dag.save(function(err) {
                    if (err) {
                        logger.error("/run ", err);
                        return res.send({
                            error: 5,
                            message: "Error guardando"
                        });
                    }

                    if (config.USEQUEUE) {
                        amqp.connect(config.QUEUE, function(err, conn) {
                            if (err) {
                                logger.error("/run ", err);
                                return res.send({
                                    error: 6,
                                    message: "Error enviando a la cola"
                                });
                            }
                            conn.createChannel(function(err, ch) {
                                var q = 'task_queue';
                                var msg = dag._id.toString();

                                ch.assertQueue(q, {
                                    durable: true
                                });
                                ch.sendToQueue(q, new Buffer(msg), {
                                    persistent: true
                                });
                                console.log(" [x] Sent '%s'", msg);
                                res.format({
                                    html: function() {
                                        res.send(nombreDir);
                                    },
                                    json: function() {
                                        res.json({
                                            id: nombreDir
                                        });
                                    }
                                });
                                logger.info({
                                    error: 0,
                                    message: "/run Directorio creado " + nombreDir
                                });
                            });
                        });
                    } else {
                        res.format({
                            html: function() {
                                res.send(nombreDir);
                            },
                            json: function() {
                                res.json({
                                    id: nombreDir
                                });
                            }
                        });
                    }
                });
            }
        });
    });
};
