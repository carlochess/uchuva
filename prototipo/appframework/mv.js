function mv(){
  var argumentos = {
    type : "text", // text,bool,area,domain
    argumento : true,
    nombroOpt : "source files",
    description : "source",
    multiple : true,
    value : [] // text(""),bool(t/f),area(""),domain([0..]),multiple([])
  };
  var argumento = {
    type : "text",
    argumento : true,
    description : "target",
    nombroOpt : "target",
    value : "",
  };
  return {
    name: "mv",
    location: "/bin/mv",
    version : "0.0.1",
    description : "move (rename) files",
    file: [],
    useDocker: false,
    image: "haskell",
    argumento : "",
    render: [
      argumentos,
      argumento
    ],
    validation: function(data){
      return true;
    },
    transformation: function(data){
      var salida = "";
      var argumentos = data[0];
      var argumento  = data[1];
      if(argumentos.value){
        argumentos.value.forEach(function(arg){
          salida += arg + " ";
        });
        salida += " ";
      }
      if(argumento.value){
        salida += argumento.value;
      }
      return salida;
    }
  };
}
