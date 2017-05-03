/*
Welcome to Racket v6.7.
racket [<option> ...] <argument> ...
 File and expression options:
  -e <exprs>, --eval <exprs> : Evaluate <exprs>, prints results
  -f <file>, --load <file> : Like -e '(load "<file>")' without printing
  -t <file>, --require <file> : Like -e '(require (file "<file>"))' [*]
  -l <path>, --lib <path> : Like -e '(require (lib "<path>"))' [*]
  -p <package> : Like -e '(require (planet "<package>")' [*]
  -r <file>, --script <file> : Same as -f <file> -N <file> --
  -u <file>, --require-script <file> : Same as -t <file> -N <file> --
  -k <n> <m> <p> : Load executable-embedded code from offset <n> to <p>
  -m, --main : Call `main' with command-line arguments, print results
  [*] Also `require's a `main' submodule, if any
 Configuration options:
  -c, --no-compiled : Disable loading of compiled files
  -q, --no-init-file : Skip load of ~/.racketrc for -i
  -I <path> : Set <init-lib> to <path> (sets language)
  -X <dir>, --collects <dir> : Main collects at <dir> (or "" disables all)
  -S <dir>, --search <dir> : More collects at <dir> (after main collects)
  -G <dir>, --config <dir> : Main configuration directory at <dir>
  -A <dir>, --addon <dir> : Addon directory at <dir>
  -R <paths>, --compiled <paths> : Set compiled-file search roots to <paths>
  -U, --no-user-path : Ignore user-specific collects, etc.
  -N <file>, --name <file> : Sets `(find-system-path 'run-file)' to <file>
  -j, --no-jit : Disable the just-in-time compiler
  -d, --no-delay: Disable on-demand loading of syntax and code
  -b, --binary : Read stdin and write stdout/stderr in binary mode
  -W <levels>, --warn <levels> : Set stderr logging to <levels>
  -L <levels>, --syslog <levels> : Set syslog logging to <levels>
 Meta options:
  -- : No argument following this switch is used as a switch
  -h, --help : Show this information and exits, ignoring other options
Default options:
 If only configuration options are provided, -i is added
 If only configuration options are before the first argument, -u is added
 If -t/-l/-p/-u apears before the first -i/-e/-f/-r, -n is added
 <init-lib> defaults to racket/init
Switch syntax:
 Multiple single-letter switches can be collapsed, with arguments placed
   after the collapsed switches; the first collapsed switch cannot be --
 Example: `-ifve file expr' is the same as `-i -f file -v -e expr'
Start-up sequence:
 1. Set `current-library-collection-paths'
 2. Require `(lib "<init-lib>")' [when -i/-e/-f/-r, unless -n]
 3. Evaluate/load expressions/files in order, until first error
 4. Load "~/.racketrc" [when -i]
 5. Run read-eval-print loop [when -i]
 6. Run `((executable-yield-handler) <status>)' [unless -V]
*/
function racket(){
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

var opcionesArgs = {
  "--info":"Directs Happy to produce an info file containing detailed information about the grammar, parser states, parser actions, and conflicts. Info files are vital during the debugging of grammars.The filename argument is optional, and if omitted the info file will be written to FILE.info (where FILE is the input file name with any extension removed).",
  "--outfile":"Specifies the destination of the generated parser module. If omitted, the parser will be placed in FILE.hs, where FILE is the name of the input file with any extension removed. If FILE is - the generated parser is sent to the standard output.",
  "--magic-name":"Happy prefixes all the symbols it uses internally with either happy or Happy. To use a different string, for example if the use of happy is conflicting with one of your own functions, specify the prefix using the -m option.",
  "--template":"Instructs Happy to use this directory when looking for template files: these files contain the static code that Happy includes in every generated parser. You shouldn’t need to use this option if Happy is properly configured for your computer."
}

    var optsArgs = []
    for (var prop in opcionesArgs) {
      optsArgs.push({
        type : "text", // text,bool,area,domain
        nombroOpt : prop.substring(2),
        description : opcionesArgs[prop],
        representation: prop,
        value : "" // text(""),bool(t/f),area(""),domain([0..]),multiple([])
      })
    }

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
        name: "racket",
        location: "racket",
        version : "0.0.1",
        description : "A modern programming language in the Lisp/Scheme family, suitable for a wide range of applications.",
        file: [],
        useDocker: true,
        image: "racket",
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
                if(opcionesArgs[opt.representation]){
                  salida += opt.representation + " " + opt.value+ " ";
                }
                else if(opt.value){
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
