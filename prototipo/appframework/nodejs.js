// Tomado de http://shanelabs.com/blog/2015/04/29/man-node/
/*
node [ -v ] [ --debug | --debug-brk ] [ --v8-options ]
     [ -e command | script.js ] [ arguments ]
*/
function nodejs(){
    var opcion1 = {
	    type : "bool", // text,bool,area,domain
      nombroOpt : "Verbose",
      description : "",
      representation: "-v",
      value : false
    };

    var opcion2 = {
	    type : "bool", // text,bool,area,domain
      nombroOpt : "Debug",
      description : "",
      representation: "--debug",
      value : false // text(""),bool(t/f),area(""),domain([0..]),multiple([])
    };

    var opcion3 = {
	    type : "text", // text,bool,area,domain
      nombroOpt : "Expresion",
      representation: "-e",
      value : "" // text(""),bool(t/f),area(""),domain([0..]),multiple([])
    };

    var optsmultiples = {
    	opts : [opcion1,opcion2,opcion3],
      opciones : true,
      value : [] // text(""),bool(t/f),area(""),domain([0..]),multiple([])
    };

    var argumentos = {
	    type : "text",
      multiple : true,
      argumento : true,
      nombroOpt : "args",
      value : [],
    };

    return {
        name: "nodejs",
        location: "/usr/bin/node",
        version : "0.0.1",
        description : "node - Server-side JavaScript",
        file: [],
        useDocker: false,
        image: "node",
        argumento : "",
        render: [
            optsmultiples,
            argumentos
        ],
        validation: function(data){
            return true;
        },
        transformation: function(data){
            var salida = "";
            var optsmultiples = data[0];
            var argumentos  = data[1];
          	if(optsmultiples.value){
              optsmultiples.value.forEach(function(opt){
                if(opt.value){
                  salida += opt.representation + " "+opcion1.value;
                }
              });
            }
            salida += argumentos.value.join(" ")+" ";
            return salida;
        }
    };
}
