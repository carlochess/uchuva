/* http://man.cx/happy(1)
  happy - the parser generator for Haskell
  happy [OPTION]... file [OPTION]...
  -a, --array /  Instructs Happy to generate a parser using an array-based shift reduce parser. When used in conjunction with -g, the arrays will be encoded as strings, resulting in faster parsers. Without -g, standard Haskell arrays will be used.
  -g, --ghc /  Instructs Happy to generate a parser that uses GHC-specific extensions to obtain faster code.
  -c, --coerce / Use GHC’s unsafeCoerce# extension to generate smaller faster parsers. One drawback is that some type safety is lost, which means that a parser generated with -c may compile fine but crash at run-time. Be sure to compile your grammar without -c first to ensure it is type-correct.
  -d, --debug / Generate a parser that will print debugging information to stderr at run-time, including all the shifts, reductions, state transitions and token inputs performed by the parser.
  -l, --glr /  Instructs Happy to output a GLR parser instead of an LALR(1) parser.
  -k, --decode / Causes the GLR parser to generate code for decoding the parse forest to a list of semantic results (requires --ghc).
  -f, --filter / Causes the GLR parser to filter out nodes which aren’t required for the semantic results (an experimental optimisation, requires --ghc).

  -i [FILE], --info[=FILE] /  Directs Happy to produce an info file containing detailed information about the grammar, parser states, parser actions, and conflicts. Info files are vital during the debugging of grammars.
     The filename argument is optional, and if omitted the info file will be written to FILE.info (where FILE is the input file name with any extension removed).
  -o FILE, --outfile=FILE/ Specifies the destination of the generated parser module. If omitted, the parser will be placed in FILE.hs, where FILE is the name of the input file with any extension removed. If FILE is - the generated parser is sent to the standard output.
  -m NAME, --magic-name=NAME / Happy prefixes all the symbols it uses internally with either happy or Happy. To use a different string, for example if the use of happy is conflicting with one of your own functions, specify the prefix using the -m option.
  -t DIR, --template=DIR / Instructs Happy to use this directory when looking for template files: these files contain the static code that Happy includes in every generated parser. You shouldn’t need to use this option if Happy is properly configured for your computer.
*/
// https://linux.die.net/man/1/ghc
function happy(){
// Redirecting Output
var redirOut = [["--array","Instructs Happy to generate a parser using an array-based shift reduce parser. When used in conjunction with -g, the arrays will be encoded as strings, resulting in faster parsers. Without -g, standard Haskell arrays will be used."],
["--ghc", "Instructs Happy to generate a parser that uses GHC-specific extensions to obtain faster code."],
["--coerce","Use GHC’s unsafeCoerce# extension to generate smaller faster parsers. One drawback is that some type safety is lost, which means that a parser generated with -c may compile fine but crash at run-time. Be sure to compile your grammar without -c first to ensure it is type-correct."],
["--debug","Generate a parser that will print debugging information to stderr at run-time, including all the shifts, reductions, state transitions and token inputs performed by the parser."],
["--glr", "Instructs Happy to output a GLR parser instead of an LALR(1) parser."],
["--decode","Causes the GLR parser to generate code for decoding the parse forest to a list of semantic results (requires --ghc)."],
["--filter","Causes the GLR parser to filter out nodes which aren’t required for the semantic results (an experimental optimisation, requires --ghc).;"]];

  var optsredirOut = redirOut.map(function(opt){
    return {
	    type : "bool", // text,bool,area,domain
      nombroOpt : opt[0].substring(2),
      description : opt[1],
      representation: opt[0],
      value : false // text(""),bool(t/f),area(""),domain([0..]),multiple([])
    };
  });

var optsargs = [["--info","Directs Happy to produce an info file containing detailed information about the grammar, parser states, parser actions, and conflicts. Info files are vital during the debugging of grammars.The filename argument is optional, and if omitted the info file will be written to FILE.info (where FILE is the input file name with any extension removed)."],
  ["--outfile","Specifies the destination of the generated parser module. If omitted, the parser will be placed in FILE.hs, where FILE is the name of the input file with any extension removed. If FILE is - the generated parser is sent to the standard output."],
  ["--magic-name","Happy prefixes all the symbols it uses internally with either happy or Happy. To use a different string, for example if the use of happy is conflicting with one of your own functions, specify the prefix using the -m option."],
  ["--template","Instructs Happy to use this directory when looking for template files: these files contain the static code that Happy includes in every generated parser. You shouldn’t need to use this option if Happy is properly configured for your computer."]]

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
        name: "happy",
        location: "happy",
        version : "0.0.1",
        description : "The parser generator for Haskell",
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
