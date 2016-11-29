/*function moverArchivos(destFolder, items, convertir) {
  var arrIds = items.map(function(o) {
    return convertir ? mongoose.Types.ObjectId(o.id) : o._id
  });
  File.find({
    _id: {
      $in: arrIds
    },
    type: "file"
  }, function(err, files) {
    if (err) {
      logger.info("No encontrados");
      return;
    }
    files.map(function(o) {
      logger.info("copiando archivo "+ o.path+" hasta "+ path.join(destFolder, o.originalname) );
      controladorArchivos.copiarArchivo(o.path, path.join(destFolder, o.originalname), function (err) {
        if(err){

        }
      })
    });
  });
}

function moverCarpeta(destFolder, carpeta) {
  File.findOne({
    _id: carpeta._id
  }, function(err, carpeta) {
    fs.mkdir(path.join(destFolder, carpeta.originalname), function(err, folder) {
      if(err){
        console.log("Error al mover carpeta")
        return;
      }

      File.find({
        parent: carpeta._id.toString()
      }, function(err, hijos) {
        if (err) {
          return;
        }

        var files = hijos.filter(function(a) {
          return a.type !== "dir"
        })
        var folders = hijos.filter(function(a) {
          return a.type === "dir"
        })
        moverArchivos(path.join(destFolder, carpeta.originalname), files, false);
        folders.map(function(o) {
          moverCarpeta(path.join(destFolder, carpeta.originalname), o);
        });
      })
    });
  });
}
*/
