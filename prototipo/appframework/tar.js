function tar(){
  var opcion1 = {
    type : "bool", // text,bool,area,domain
    nombroOpt : "list",
    description : "list the contents of an archive",
    representation: "-t",
    value : false // text(""),bool(t/f),area(""),domain([0..]),multiple([])
  };
  var opcion2 = {
    type : "bool", // text,bool,area,domain
    nombroOpt : "extract",
    description : "extract files from an archive",
    representation: "-x",
    value : false // text(""),bool(t/f),area(""),domain([0..]),multiple([])
  };
  var opcion3 = {
    type : "bool", // text,bool,area,domain
    nombroOpt : "gzip",
    description : "filter the archive through gzip",
    representation: "-z",
    value : false // text(""),bool(t/f),area(""),domain([0..]),multiple([])
  };
  var opcion6 = {
    type : "text", // text,bool,area,domain
    nombroOpt : "archive",
    description : "use archive file",
    representation: "-f",
    value : "" // text(""),bool(t/f),area(""),domain([0..]),multiple([])
  };
  var opcion7 = {
    type : "text", // text,bool,area,domain
    nombroOpt : "chdir",
    description : "change to directory DIR",
    representation: "-C",
    value : "" // text(""),bool(t/f),area(""),domain([0..]),multiple([])
  };
  var opcion8 = {
    type : "text", // text,bool,area,domain
    nombroOpt : "create",
    description : "create a new archive",
    representation: "-c",
    multiple: true,
    value : [] // text(""),bool(t/f),area(""),domain([0..]),multiple([])
  };
  var opcion9 = {
    type : "text", // text,bool,area,domain
    nombroOpt : "concatenate",
    description : "Append tar files to an archive",
    representation: "-A",
    multiple: true,
    value : [] // text(""),bool(t/f),area(""),domain([0..]),multiple([])
  };
  var opcion10 = {
    type : "text", // text,bool,area,domain
    nombroOpt : "append",
    description : "append files to the end of an archive ",
    representation: "-r",
    multiple: true,
    value : [] // text(""),bool(t/f),area(""),domain([0..]),multiple([])
  };
  var optsmultiples = {
    opts : [opcion1,opcion2,opcion3,opcion6,opcion7,opcion8,opcion9,opcion10],
    opciones : true,
    value : [] // text(""),bool(t/f),area(""),domain([0..]),multiple([])
  };
  return {
    name: "tar",
    location: "/bin/tar",
    version : "0.0.1",
    description : "concatenate files and print on the standard output",
    file: [],
    useDocker: false,
    image: "haskell",
    argumento : "",
    render: [
      optsmultiples,
    ],
    validation: function(data){
      return true;
    },
    transformation: function(data){
      var salida = "";
      var optsmultiples = data[0];
      if(optsmultiples.value){
        optsmultiples.value.forEach(function(opt){
          if(-1 != ["gzip","extract","list"].indexOf(opt.nombroOpt)){
            if(opt.value)
            	salida += opt.representation + " ";
          }else if (-1 != ["archive","chdir"].indexOf(opt.nombroOpt)){
            salida += opt.representation + " " + opt.value + " ";
          }else if (-1 != ["append","concatenate","create"].indexOf(opt.nombroOpt)){
            salida += opt.representation + " " + opt.value.join(" ") + " ";
          }
        });
      }
      return salida;
    }
  };
}
