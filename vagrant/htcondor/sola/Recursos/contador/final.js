var fs = require('fs');
var suma = 0;

function leerArchivos(f){
    leidos = 0;
    for(var i = 1; i< 5; i++){
        fs.readFile('suma'+i, (err, data) => {
          if (err) {
            console.log(err)
            throw err;
          }
          suma+=parseInt(data);
          leidos++
          if(leidos == 4)
            f()
        });
   }
}


leerArchivos(() => {
    fs.writeFile("resultado", suma+"", function(err) {
      if (err) {
        console.log(err)
        process.exit(1);
        return
      }
    }); 
})
