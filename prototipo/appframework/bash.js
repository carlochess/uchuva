function bash(){
  var argumento = {
    type : "text",
    argumento : true,
    nombroOpt : "arg",
    value : "",
  };
  return {
    name: "bash",
    location: "/bin/bash",
    version : "0.0.1",
    description : "command language interpreter",
    file: [],
    useDocker: false,
    image: "haskell",
    argumento : "",
    render: [
      argumento
    ],
    validation: function(data){
      return true;
    },
    transformation: function(data){
      var salida = "";
      var argumento = data[0];
      if(argumento.value){
        salida += argumento.value;
      }
      return salida;
    }
  };
}
