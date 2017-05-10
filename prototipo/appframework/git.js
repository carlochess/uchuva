function git(){
  var opcion1 = {
    type : "text", // text,bool,area,domain
    nombroOpt : "Clone",
    description : "clone a repository from an url",
    representation: "clone",
    value : "" // text(""),bool(t/f),area(""),domain([0..]),multiple([])
  };
  return {
    name: "git",
    location: "/usr/bin/git",
    version : "0.0.1",
    description : "git - the stupid content tracker",
    file: [],
    useDocker: false,
    image: "haskell",
    argumento : "",
    render: [
      opcion1
    ],
    validation: function(data){
      return true;
    },
    transformation: function(data){
      var salida = "";
      var opt = data[0];
      if(opt.value){
        salida += opt.representation + " " + opt.value;
      }
      return salida;
    }
  };
}
