function mkdir(){
  var opcion1 = {
    type : "bool", // text,bool,area,domain
    nombroOpt : "Parents",
    description : "no error if existing, make parent directories as needed",
    representation: "-p",
    value : false // text(""),bool(t/f),area(""),domain([0..]),multiple([])
  };
  var argumento = {
    type : "text",
    argumento : true,
    nombroOpt : "args",
    value : "",
  };
  return {
    name: "mkdir",
    location: "/bin/mkdir",
    version : "0.0.1",
    description : "Create the DIRECTORY(ies), if they do not already exist. ",
    file: [],
    useDocker: false,
    image: "haskell",
    argumento : "",
    render: [
      opcion1,
      argumento
    ],
    validation: function(data){
      return true;
    },
    transformation: function(data){
      var salida = "";
      var opcion1 = data[0];
      var argumento  = data[1];
      if(opcion1.value){
        salida += opcion1.representation + " ";
      }
      if(argumento.value){
        salida += argumento.value;
      }
      return salida;
    }
  };
}
