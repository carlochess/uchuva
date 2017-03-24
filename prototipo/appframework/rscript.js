function rscript(){
    var opcion1 = {
	    type : "bool", // text,bool,area,domain
      nombroOpt : "Verbose",
      description : "gives details of what Rscript is doing. Also passed on to R.",
      representation: "--verbose",
      value : false // text(""),bool(t/f),area(""),domain([0..]),multiple([])
    };

    var opcion2 = {
	    type : "text", // text,bool,area,domain
      nombroOpt : "Packages",
      multiple: true,
      description : "Is a comma-separated list of package names or NULL",
      representation: "--default-packages=",
      value : [] // text(""),bool(t/f),area(""),domain([0..]),multiple([])
    };

    var optsmultiples = {
    	opts : [opcion1,opcion2],
      opciones : true,
      value : [] // text(""),bool(t/f),area(""),domain([0..]),multiple([])
    };

    var opcion3 = {
	  type : "text",  //type : "domain", // bool,area,domain
      nombroOpt : "Expression",
      description : "R expression(s), properly quoted.",
      representation: "-e",
      multiple: true,
      value : [] // text(""),bool(t/f),area(""),domain([0..]),multiple([])
    };

    var expmultiples = {
    	opts : [opcion3],
      opciones : true,
      value : [] // text(""),bool(t/f),area(""),domain([0..]),multiple([])
    };

    var argumentos = {
	    type : "text",
      multiple : true,
      argumento : true,
      nombroOpt : "args",
      value : [""],
    };

    return {
        name: "rscript",
        location: "rscript",
        version : "0.0.1",
        description : "This is an alternative front end for use in #! scripts and other scripting applications.",
        file: [],
        useDocker: true,
        image: "r-base",
        argumento : "",
        render: [
            optsmultiples,
            expmultiples,
            argumentos
        ],
        validation: function(data){
            return true;
        },
        transformation: function(data){
            var salida = "";
            var optsmultiples = data[0].value.join(" ")+" ";
            var expmultiples = data[1].value.map(function(exp){
              return "-e "+exp.value;
            }).join(" ")+" ";
            var argumentos  = data[2].value.join(" ")+" ";
            salida += optsmultiples + expmultiples + argumentos;
            return salida;
        }
    };
}
