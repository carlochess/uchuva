var fs = require("fs");

var X = 25;
var Y = 25;

var separacion = 80;

var nodes = [];
var edges = [];
for(var i=0; i< Y; i++){
  for(var j=0; j< X; j++){
    nodes.push({
      id:i*Y+j,
      title:"Nueva Tarea "+i*Y+j,
      x:i*separacion,
      y:j*separacion,
      "configurado":{"name":"cat","location":"/bin/cat","version":"0.0.1","description":"concatenate files and print on the standard output","file":[],"useDocker":false,"image":"haskell","argumento":"","render":[{"opts":[{"type":"bool","nombroOpt":"Show-all","description":"number nonempty output lines, overrides -n","representation":"-A","value":false},{"type":"bool","nombroOpt":"Number","description":"number all output lines","representation":"--number","value":false},{"type":"bool","nombroOpt":"Show-tabs","representation":"-T","value":false}],"opciones":true,"value":[],"id":"0"},{"type":"text","multiple":true,"argumento":true,"nombroOpt":"args","value":["/etc/hosts"],"id":"1"}]}
    });
  }
}

for(var i=0; i< Y-1; i++){
  for(var j=0; j< X-1; j++){
    edges.push({source : {id : nodes[i*Y+j].id}, target : {id : nodes[i*Y+(j+1)].id}});
    edges.push({source : {id : nodes[i*Y+j].id}, target : {id : nodes[(i+1)*Y+j].id}});
  }
}

var data = JSON.stringify({
  proyecto:"58dc7c33a9447885a8dbbe26",
  nodes : nodes,
  edges : edges,
  workloader : "htcondor"
});

fs.writeFile("mydag.json", data, "utf-8", function(err){
  if(err){
    return console.log(err);
  }
  console.log("Guardado");
});
