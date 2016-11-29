fs = require('fs')
path = require('path');

var leerArchivo = function(archivo, cb){
    fs.readFile(archivo, 'utf8', function (err,data) {
      if (err) {
        return cb(err, null);
      }
      return cb(null, data);
    });
}

var escribirEnArchivo = function(archivo, contenido, cb){
    fs.writeFile(archivo, contenido, function(err) {
      if (err) {
        return cb(err, null);
      }
      return cb(null);
    }); 
}

var clasificar = function (text) {
    var acc = [[],[],[],[]];
    return text.toLowerCase()
        .match(/[a-z][a-z0-9]+/gi)
        .reduce(function (acc, word) {
            var indice = Math.floor(parseCharInt(word[0])/7)
            acc[indice].push(word);
            return acc;
    }, acc);
};

function parseCharInt(code){
    return 'abcdefghijklmnopqrstuvwxyz'.indexOf(code);
}

leerArchivo("trial.txt", function(err, datos){
    if(err){
        console.log(err)
        process.exit(1);
        return
    }
    fs.mkdir("out", function(folder){
        var resultados = clasificar(datos)
        for(var i =0; i< 4; i++){
            escribirEnArchivo("out/intervalo"+(i+1), resultados[i], function(err){
                 if(err){
                    console.log("Error en escribiendo archivo", i+1)
                 }
            })
        }
   })
})
