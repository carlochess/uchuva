var path   = require('path');

function normalizePath(ruta){
  if(typeof ruta !== "string"){
    return undefined;
  }
  if(ruta.trim().length === 0){
    return undefined;
  }
  return path.normalize(ruta.split(path.sep).filter(function(elem) {
    return elem !== "" && elem !== ".." && elem !== ".";
  }).join(path.sep));
}

exports.normalizePath = normalizePath;
