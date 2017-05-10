function wget(){
  var opcion1 = {
    type : "bool", // text,bool,area,domain
    nombroOpt : "Location",
    description : "If the server reports that the requested page has moved to a different location",
    representation: "-L",
    value : false // text(""),bool(t/f),area(""),domain([0..]),multiple([])
  };
  var opcion2 = {
    type : "bool", // text,bool,area,domain
    nombroOpt : "Remote-name",
    description : "Write output to a local file named like the remote file we get.",
    representation: "-O",
    value : false // text(""),bool(t/f),area(""),domain([0..]),multiple([])
  };
  var optsmultiples = {
    opts : [opcion1,opcion2],
    opciones : true,
    value : [] // text(""),bool(t/f),area(""),domain([0..]),multiple([])
  };
  var argumento = {
    type : "text",
    argumento : true,
    nombroOpt : "args",
    value : "",
  };
  return {
    name: "wget",
    location: "wget",
    version : "0.0.1",
    description : "wget is a tool to transfer data from or to a server, using various supported protocols",
    file: [],
    module : "wget/1.17.1-foss-2016a",
    argumento : "",
    render: [
      optsmultiples,
      argumento
    ],
    validation: function(data){
      return true;
    },
    transformation: function(data){
      var salida = "";
      var optsmultiples = data[0];
      var argumento  = data[1];
      if(optsmultiples.value && optsmultiples.value.length > 0){
        salida += "-";
        optsmultiples.value.forEach(function(opt){
          if(opt.value){
            salida += opt.representation.charAt(1);
          }
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
