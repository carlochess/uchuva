function test(){
    var opcion1 = {
	    type : "domain", // text,bool,area,domain
      domainElems : "bool,area,domain".split(","),
      multiple : false,
      nombroOpt : "Opt1",
      description : "number all output lines",
      representation: "--number",
      value : "domain" // text(""),bool(t/f),area(""),domain([0..]),multiple([])
    };

    var opcion2 = {
	    //type : "domain", // bool,area,domain
      domainElems : "bool,area,domain".split(","),
      multiple : true,
      nombroOpt : "Opt2",
      description : "number all output lines",
      representation: "--number",
      value : ["perro","perro2","perro3"] // text(""),bool(t/f),area(""),domain([0..]),multiple([])
    };

    var opcion3 = {
	    type : "bool", // bool,area,domain
      domainElems : "bool,area,domain".split(","),
      multiple : false,
      nombroOpt : "Opt3",
      description : "number all output lines",
      representation: "--number",
      value : true // text(""),bool(t/f),area(""),domain([0..]),multiple([])
    };

    var opcion4 = {
	    type : "area", // bool,area,domain
      domainElems : "bool,area,domain".split(","),
      multiple : false,
      nombroOpt : "Opt4",
      description : "number all output lines",
      representation: "--number",
      value : "perro" // text(""),bool(t/f),area(""),domain([0..]),multiple([])
    };

    var optsmultiples = {
    	opts : [opcion2,opcion3,opcion4],
      opciones : true,
      description : "number all output lines",
      representation: "--number",
      value : [opcion3,opcion4,opcion2] // text(""),bool(t/f),area(""),domain([0..]),multiple([])
    };

    var argumento = {
	    type : "text", // text,area,domain
      domainElems : "bool,area,domain".split(","),
      multiple : true,
      argumento : true,
      nombroOpt : "arg",
      description : "number all output lines",
      value : "bool,area,domain".split(","), // text(""),area(""),domain(domainElems[N]),multiple([])
    };

    return {
        name: "test",
        version : "0.0.1",
        description : "test all args/opt that this framework can offer",
        file: [],
        useDocker: false,
        image: "haskell",
        argumento : "",
        render: [
            opcion1, // () -> obj
            opcion2, // () -> obj
            optsmultiples,
            argumento // () -> obj
        ],
        validation: function(data){
            return true;
        },
        transformation: function(data){
            var salida = "test ";
            var opcion1 = data[0];
            var opcion2  = data[1];
            var optsmultiples = data[2];
            var argumento  = data[3];
            salida += opcion1.nombroOpt+"="+opcion1.value+" ";
            salida += opcion2.nombroOpt+","+opcion1.value+" ";
            salida += argumento.value.join(" ")+" ";
            return salida;
        }
    };
}
