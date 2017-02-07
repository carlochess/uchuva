var torque = require("./main.js");

var atributos = { 
//"Execution_Time" : "06:00" ,
//"Error_Path" : "/vagrant/err",
//"Output_Path" : "/vagrant/out",
//"Job_Name" : "nada",
//"depend" : Defines the inter\-job dependencies.
//"stagein" : Defines the list of files to be staged in prior to job execution.
//"stageout" : Defines the list of files to be staged out after job execution.
};

torque.connect(null, function(err, conn){
    //console.log(torque.pbs_query_max_connections());
    torque.submit(conn, null , "/vagrant/hola.submit",null,null,function(err, res){
        console.log(res);
        torque.disconnect(conn,function(err, res){
            console.log(res);
        });
    });
});
