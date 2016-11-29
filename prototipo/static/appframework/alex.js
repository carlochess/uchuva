/* http://man.cx/ALEX
alex − the lexical analyser generator for Haskell
alex [OPTION]... file [OPTION]...

−d, −−debug / Instructs Alex to generate a lexer which will output debugging messsages as it runs.
−g, −−ghc / Instructs Alex to generate a lexer which is optimised for compiling with GHC. The lexer will be significantly more efficient, both in terms of the size of the compiled lexer and its runtime.

−o FILE, −−outfile=FILE / Specifies the filename in which the output is to be placed. By default, this is the name of the input file with the .x suffix replaced by .hs
−i [FILE], −−info[=FILE] / Produces a human-readable rendition of the state machine (DFA) that Alex derives from the lexer, in FILE (default: file.info where the input file is file.x ).
*/
function alex(){
// Redirecting Output
var redirOut = [["−−debug","Instructs Alex to generate a lexer which will output debugging messsages as it runs."],
["−−ghc", "Instructs Alex to generate a lexer which is optimised for compiling with GHC. The lexer will be significantly more efficient, both in terms of the size of the compiled lexer and its runtime."]];
  var optsredirOut = redirOut.map(function(opt){
    return {
	    type : "bool", // text,bool,area,domain
      nombroOpt : opt[0].substring(2),
      description : opt[1],
      representation: opt[0],
      value : false // text(""),bool(t/f),area(""),domain([0..]),multiple([])
    };
  });

var optsargs = [["−−outfile","Directs Happy to produce an info file containing detailed information about the grammar, parser states, parser actions, and conflicts. Info files are vital during the debugging of grammars.The filename argument is optional, and if omitted the info file will be written to FILE.info (where FILE is the input file name with any extension removed)."],
  ["−−info","Specifies the destination of the generated parser module. If omitted, the parser will be placed in FILE.hs, where FILE is the name of the input file with any extension removed. If FILE is - the generated parser is sent to the standard output."]]

  var optsArgs = optsargs.map(function(opt){
    return {
      type : "text", // text,bool,area,domain
      nombroOpt : opt[0].substring(2),
      description : opt[1],
      representation: opt[0],
      value : "" // text(""),bool(t/f),area(""),domain([0..]),multiple([])
    };
  });

    var optsmultiples = {
    	opts : optsredirOut.concat(optsArgs),
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
        name: "alex",
        location: "alex",
        version : "0.0.1",
        description : "The lexical analyser generator for Haskell",
        file: [],
        useDocker: true,
        image: "haskell",
        argumento : "",
        render: [
            optsmultiples,
            argumentos,
            optsmultiples
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
