function docker(){
    var opcion1 = {
	  type : "bool", // text,bool,area,domain
      nombroOpt : "Show-all",
      description : "number nonempty output lines, overrides -n",
      representation: "-A",
      value : false // text(""),bool(t/f),area(""),domain([0..]),multiple([])
    };

    var opcion2 = {
	  type : "bool", // text,bool,area,domain
      nombroOpt : "Number",
      description : "number all output lines",
      representation: "--number",
      value : false // text(""),bool(t/f),area(""),domain([0..]),multiple([])
    };

    var opcion3 = {
      type : "bool", // text,bool,area,domain
      nombroOpt : "Show-tabs",
      representation: "-T",
      value : false // text(""),bool(t/f),area(""),domain([0..]),multiple([])
    };

    var optsmultiples = {
      opts : [opcion1,opcion2,opcion3],
      opciones : true,
      value : [] // text(""),bool(t/f),area(""),domain([0..]),multiple([])
    };

    var argumentos = {
	  type : "text",
      multiple : false,
      argumento : true,
      nombroOpt : "image",
      value : [""],
    };

    return {
        name: "dockerrun",
        location: "/usr/bin/docker",
        version : "0.0.1",
        description : "the container process that runs is isolated in that it has its own file system, its own networking, and its own isolated process tree separate from the host.",
        file: [],
        useDocker: false,
        image: "haskell",
        argumento : "",
        render: [
            optsmultiples,
            argumentos
        ],
        validation: function(data){
            return true;
        },
        transformation: function(data){
            var salida = " run ";
            var optsmultiples = data[0];
            var argumentos  = data[1];
            if(optsmultiples.value){
              optsmultiples.value.forEach(function(opt){
                if(opt.value){
                  salida += opt.representation + " ";
                }
              });
            }
            if(argumentos.value){
                salida += argumentos.value.join(" ")+" ";
            }
            return salida;
        }
    };
}
