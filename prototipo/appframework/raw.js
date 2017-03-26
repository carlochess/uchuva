function raw(){
  var argumento = {
    type : "text",
    argumento : true,
    nombroOpt : "command",
    value : ""
  };
  return {
    name: "raw",
    location: "",
    version : "0.0.1",
    description : "execute raw command",
    file: [],
    useDocker: false,
    argumento : "",
    render: [
      argumento
    ],
    validation: function(data){
      var comm = data[0].value.split(" ");
      return comm[0] !== "";
    },
    transformation: function(data){
      var input = data[0].value.split(" ");
      return input;
    }
  };
}
