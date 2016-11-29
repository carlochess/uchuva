/*const spawn = require( 'child_process' ).spawnSync;
const ls = spawn( 'sbatch', ["/vagrant/data/run/jY26u/nueva_tarea_3.bash"],);

console.log( `stderr: ${ls.stderr.toString()}` );
console.log( `stdout: ${ls.stdout.toString()}` );*/

var exec = require('child_process').exec;
//var fs = require('fs')

const proc = exec( 'cat nueva_tarea_0.bash | bsub', {
            cwd: "/vagrant/data/run/2C8F6",
            timeout : 25,
        },function(error, stdout, stderr) {
          if (error) {
              console.log("->e"+error);
              return;
          }
          if (stderr) {
              console.log("->e"+stderr);
              return;
          }
          console.log("->o"+stdout);
});
/*
const exec = require('child_process').exec;
exec('cat *.js | wc -l', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
});
*/
