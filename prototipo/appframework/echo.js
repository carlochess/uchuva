/* https://linux.die.net/man/1/echo
echo - display a line of text
echo [SHORT-OPTION]... [STRING]...
echo LONG-OPTION*/

function echo(){
    var opcion1 = {
	    type : "bool", // text,bool,area,domain
      nombroOpt : "no new line",
      description : "do not output the trailing newline",
      representation: "-n",
      value : false // text(""),bool(t/f),area(""),domain([0..]),multiple([])
    };

    var opcion2 = {
	    type : "bool", // text,bool,area,domain
      nombroOpt : "Enable backslash",
      description : "enable interpretation of backslash escapes",
      representation: "-e",
      value : false // text(""),bool(t/f),area(""),domain([0..]),multiple([])
    };

    var opcion3 = {
	    type : "bool", // text,bool,area,domain
      nombroOpt : "Disable backslash",
      description : "disable interpretation of backslash escapes (default)",
      representation: "-E",
      value : true // text(""),bool(t/f),area(""),domain([0..]),multiple([])
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
        name: "echo",
        location: "/bin/echo",
        version : "0.0.1",
        description : "print string to standard output",
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
