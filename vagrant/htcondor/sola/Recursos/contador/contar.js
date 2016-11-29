// echo {1..4} | xargs -n 1 node contar.js
var fs = require('fs');
var suma = 0;

function leerArchivo(archivo, i){
    readableStream = fs.createReadStream(archivo);
    readableStream.setEncoding('utf8');
    readableStream.on('data', sumar);
    readableStream.on('end', function() {
        fs.writeFile("suma"+ i, suma+"", function(err) {
        });
    });
    readableStream.on('error', function(err){
        console.log(err)
        process.exit(1);
    });
}

function sumar(chunk) {
    suma += chunk.length
}

args = process.argv.slice(2)

leerArchivo("out/intervalo"+args[0], args[0])
