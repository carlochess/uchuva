function rawdocker(){
  var image = {
    type : "text",
    argumento : true,
    nombroOpt : "image",
    value : ""
  };
  var argumento = {
    type : "text",
    argumento : true,
    nombroOpt : "command",
    value : ""
  };
  return {
    name: "rawdocker",
    location: "",
    version : "0.0.1",
    description : "execute raw command on docker",
    file: [],
    useDocker: true,
    argumento : "",
    render: [
      image,
      argumento
    ],
    validation: function(data){
      var comm = data[1].value.split(" ");
      return comm[1] !== "" && data[0].value !== "";
    },
    transformation: function(data){
      var image = data[0].value;
      var input = data[1].value.split(" ");
      return [image].concat(input);
    }
  };
}
