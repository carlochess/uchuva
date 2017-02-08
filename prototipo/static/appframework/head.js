function head(){
    var argumentos = {
      type : "text",
      multiple : true,
      argumento : true,
      nombroOpt : "args",
      value : ["/etc/hosts"],
    };

    return {
        name: "head",
        location: "/bin/head",
        version : "0.0.1",
        description : "Output the first part of files",
        file: [],
        useDocker: false,
        image: "haskell",
        argumento : "",
        render: [
            argumentos
        ],
        validation: function(data){
            return true;
        },
        transformation: function(data){
            var salida = "";
            var argumentos = data[0];
            if(argumentos.value){
                salida += argumentos.value.join(" ")+" ";
            }
            return salida;
        }
    };
}
