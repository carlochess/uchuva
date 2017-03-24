// http://man.cx/sleep
function sleep(){
    var argumento = {
	    type : "text",
      multiple : false,
      argumento : true,
      nombroOpt : "time",
      value : ["8"],
    };

    return {
        name: "sleep",
        location: "/bin/sleep",
        version : "0.0.1",
        description : " suspend execution for an interval",
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
            var argumento  = data[0];
            if(argumento.value){
                salida += argumento.value+" ";
            }
            return salida;
        }
    };
}
