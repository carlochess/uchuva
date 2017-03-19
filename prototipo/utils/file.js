var
  fs     = require('fs'),
  path   = require('path'),
  crypto = require('crypto'),
  exists = fs.exists || path.exists,

RANDOM_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

/**
 * Random name generator based on crypto.
 * Adapted from http://blog.tompawlak.org/how-to-generate-random-values-nodejs-javascript
 *
 * @param {Number} howMany
 * @return {String}
 * @api private
 */
function randomChars(howMany) {
  var
    value = [],
    rnd = null;

  // make sure that we do not fail because we ran out of entropy
  try {
    rnd = crypto.randomBytes(howMany);
  } catch (e) {
    rnd = crypto.pseudoRandomBytes(howMany);
  }

  for (var i = 0; i < howMany; i++) {
    value.push(RANDOM_CHARS[rnd[i] % RANDOM_CHARS.length]);
  }

  return value.join('');
}

function generarNombre(cb){
  var tries = 5;
  if (isNaN(tries) || tries < 0)
    return cb(new Error('Invalid tries'));

  (function _getUniqueName() {
    var name = randomChars(tries);

    // check whether the path exists then retry if needed
    exists(name, function _pathExists(pathExists) {
      if (pathExists) {
        if (tries-- > 0) return _getUniqueName();
        return cb(new Error('Mala suerte' + name));
      }
      cb(null, name);
    });
  }());
}
function crearDirectorio(directorio, cb){
	generarNombre(function(err, nombreAleatorio){
		if(err)
			return cb(err, "");
		fs.mkdir(directorio+"/"+nombreAleatorio, 0777, function(err){
			if(err)
				return cb(err, "");
			cb(null, nombreAleatorio);
		});
	});
}

function eliminarDirectorio(directorio, cb){
	fs.rmdir(directorio, function(err){
		return cb(err, "");
	});
}

function eliminarArchivo(archivo, cb){
	fs.unlink(archivo, function(err){
		return cb(err);
	});
}

function crearArchivo(archivo,dagOut, cb){
	fs.writeFile(archivo, dagOut, function(err) {
	   cb(err);
	});
}

function crearArchivoSync(archivo,dagOut){
    fs.writeFileSync(archivo, dagOut);
}

function leerArchivo(archivo, cb){
    fs.readFile(archivo, 'utf8', cb);
}

function copiarArchivo(origen, destino, cb){
  var cbCalled = false;
  var rd = fs.createReadStream(origen);
  rd.on("error", function(err) {
    done(err);
  });
  var wr = (typeof destino == "string")? fs.createWriteStream(destino) : destino;
  wr.on("error", function(err) {
    done(err);
  });
  wr.on("close", function(ex) {
    done();
  });
  rd.pipe(wr);

  function done(err) {
    if (!cbCalled) {
      cb(err);
      cbCalled = true;
    }
  }
}
exports.crearDirectorio = crearDirectorio;
exports.crearArchivo = crearArchivo;
exports.crearArchivoSync = crearArchivoSync;
exports.leerArchivo = leerArchivo;
exports.generarNombre = generarNombre;
exports.copiarArchivo = copiarArchivo;
exports.randomChars = randomChars;
