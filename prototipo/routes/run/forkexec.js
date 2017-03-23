var exec = require('child_process').exec;
var SSH = require('simple-ssh');
var config = require('../../config.js');
var logger = require('../../utils/logger.js');

var enviar = function(comando, config, cb) {
  logger.info("Ejecutando", comando);
  var proc = exec(comando , config, function(error, stdout, stderr) {
    if (error) {
      return cb(error.message);
    }
    if (stderr) {
      return cb(stderr);
    }
    return cb(null, stdout);
  });
  proc.on("error", function(err){
    cb(err);
  });
  proc.on('close', function(code) {
    logger.info("Return code", code);
  });
};

var enviarssh = function(comando, config, cb) {
  var ssh = new SSH(config).on('error', function(err){
    return cb(err);
  });
  ssh.exec(comando, {
      out: function(stdout) {
        return cb(null, stdout);
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

exports.enviar = enviar;
exports.enviarssh = enviarssh;
