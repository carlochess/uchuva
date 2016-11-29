// https://linux.die.net/man/1/ghc
function ghc(){

// Redirecting Output
var redirOut = [["-hcsuf","set the suffix to use for intermediate C files [dynamic]"],
  ["-hidir","set directory for interface files [dynamic]"],
  ["-hisuf", "set the suffix to use for interface files [dynamic]"],
  ["-odir", "set directory for object files [dynamic]"],
  ["-o", "set output filename [dynamic]"],
  ["-ohi", "set the filename in which to put the interface [dynamic]"],
  ["-osuf", "set the output file suffix [dynamic]"],
  ["-stubdir", "redirect FFi stub files [dynamic]"],
  ["-outputdir", "set output directory [dynamic]"]];

  var optsredirOut = redirOut.map(function(opt){
    return {
	    type : "text", // text,bool,area,domain
      nombroOpt : opt[0].substring(1),
      description : opt[1],
      representation: opt[0],
      value : "" // text(""),bool(t/f),area(""),domain([0..]),multiple([])
    };
  });

    var opcion2 = {
	    type : "bool", // text,bool,area,domain
      nombroOpt : "Number",
      description : "number all output lines",
      representation: "--make",
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
      value : ["main.hs"],
    };

    return {
        name: "ghc",
        location: "ghc",
        version : "0.0.1",
        description : "The Glasgow Haskell Compiler",
        file: [],
        useDocker: true,
        image: "haskell",
        argumento : "",
        render: [
            optsredirOut.concat(optsmultiples),
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
