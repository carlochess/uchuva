var soap = require('soap');
var url = 'http://localhost:8080/';
var file = __dirname 
var options = {};
/*
soap.createClient(file+ '/condorCollector.wsdl', options, function (err, client) {
	//console.dir(client);
	if(err){
		console.log("Error al conectar");
		return;
	}
	client.getVersionString({}, function(err, result) {
		if(err){
			console.log("Error al conectar");
			return;
		}
		//console.dir(result);
	});
	
	client.queryScheddAds({}, function(err,result){
		//console.dir(result);
	});
	
},url);
*/

soap.createClient(file+ '/condorSchedd.wsdl', options, function (err, client) {
	//console.dir(client);
	if(err){
		console.log("Error al conectar");
		return;
	}
	//----------- result.response ----------------//
	/*
	// () -> StringAndStatus
	// StringAndStatus = { status::Status , message::string}
	// Status = { code :: StatusCode , message :: string,  next :: Status }
	// StatusCode = SUCCESS | FAIL | INVALIDTRANSACTION | UNKNOWNCLUSTER | UNKNOWNJOB | UNKNOWNFILE | INCOMPLETE | INVALIDOFFSET | ALREADYEXISTS deriving Enum
	client.getPlatformString({}, function(err, result) {
		if(err){
			console.log("Error al conectar");
			return;
		}
		//console.dir(result.response);
	});
	
	// () -> StringAndStatus
	// StringAndStatus = { status::Status , message::string
	// Status = { code :: StatusCode , message :: string,  next :: Status }
	// StatusCode = SUCCESS | FAIL | INVALIDTRANSACTION | UNKNOWNCLUSTER | UNKNOWNJOB | UNKNOWNFILE | INCOMPLETE | INVALIDOFFSET | ALREADYEXISTS deriving Enum
	client.getVersionString({}, function(err, result) {
		if(err){
			console.log("Error al conectar");
			return;
		}
		//console.dir(result.response);
	});
	
	
	// { transaction :: Transaction , constraint :: string } -> ClassAdStructArrayAndStatus
	// ClassAdStructArrayAndStatus = {status :: Status , classAdArray :: ClassAdStructArray}
	// ClassAdStructArray = {item :: ClassAdStruct}
	// ClassAdStruct = [{item :: ClassAdStructAttr}]
	// ClassAdStructAttr = {name ::string , type::ClassAdAttrType , value::string }
	// ClassAdAttrType = INTEGER-ATTR | FLOAT-ATTR | STRING-ATTR | EXPRESSION-ATTR | BOOLEAN-ATTR | UNDEFINED-ATTR | ERROR-ATTR	
	client.getJobAds({}, function(err, result) {
		if(err){
			console.log("Error al conectar");
			return;
		}
		var respuesta = result.response;
		//console.log(respuesta.classAdArray.item[0].item);
		elem.forEach(function(e){
			console.dir(elem);
		});
	});*/
	var tt = null;
	var cl = null;
	var jb = null;
	// int -> {status :: Status ,  transaction :: Transaction}
	// Status = { code :: StatusCode , message :: string,  next :: Status }
	// StatusCode = SUCCESS | FAIL | INVALIDTRANSACTION | UNKNOWNCLUSTER | UNKNOWNJOB | UNKNOWNFILE | INCOMPLETE | INVALIDOFFSET | ALREADYEXISTS deriving Enum
	// Transaction = { id :: int, duration :: int } 
	console.log("---- Iniciando transaccion");
	client.beginTransaction({duration:60}, function(err, result) {
		if(err){
			console.log("Error al conectar");
			return;
		}
		tt = result.response.transaction;
		console.dir(result);
	//});
	console.log("---- Iniciando cluster");
	client.newCluster({transaction : tt}, function(err, result) {
		if(err){
			console.log("Error al conectar");
			return;
		}
		cl = result.response.integer;
		console.dir(result);
	//});
	
	console.log("---- Iniciando job");
	client.newJob({transaction : tt, cluster : cl}, function(err, result) {
		if(err){
			console.log("Error al conectar");
			return;
		}
		console.dir(result);
		jb = result.response.integer;
	//});
	/*
	//------------------
	
	//
	// Create a simple job that will sleep 
	// for 30 seconds.
    //
    var owner = "vagrant";
    var type = "VANILLA";
    var executable = "/bin/sleep";
    var arguments = "31";
    var requirements = "TRUE"; 
    //  -> ClassAdStructAndStatus 
    client.createJobTemplate({clusterId:cl,
                            jobId:jb,
                            owner:owner,
                            type:type,
                            cmd:executable,
                            args:arguments,
                            requirements:requirements} , function(err, result) {
		if(err){
			console.log("Error al conectar");
			return;
		}
		console.dir(result.response.classAd);
	
	
                   
                   // Add some more info into the ClassAd
                   //
                   var classAd = new List<ClassAdStructAttr> ();
                   classAd.FromArray(jobAd.classAd);
                   classAd.Add( 
                       new ClassAdStructAttr(
                           "NTDomain",
                           ClassAdAttrType.STRINGATTR,
                           "BART"));
                   classAd.Add( 
                       new ClassAdStructAttr(
                           "OpSys",
                           ClassAdAttrType.STRINGATTR,
                           "WINNT51"));
                   classAd.Add(
                       new ClassAdStructAttr(
                           "UserLog",
                           ClassAdAttrType.STRINGATTR,
                           "C:\\sleep.$(cluster).$(process).log"));
                   classAd.Add(
                       new ClassAdStructAttr(
                           "Output",
                           ClassAdAttrType.STRINGATTR,
                           "C:\\sleep.$(cluster).$(process).output.log"));
                   classAd.Add(
                       new ClassAdStructAttr(
                           "Err",
                           ClassAdAttrType.STRINGATTR,
                           "C:\\sleep.$(cluster).$(process).error.log"));
                   classAd.Add(
                       new ClassAdStructAttr(
                           "In",
                           ClassAdAttrType.STRINGATTR,
                           "NUL"));
		*/
	/*
    // Enviar el job
    // -> RequirementsAndStatus             
    var classAd = [];
	client.submit({transaction: tt,clusterId:cl,jobId:jb,jobAd:classAd},function(error, result){
		if (error) {
        	return;
		}
		console.dir(result);
	
	
	//------------------
	
	// Transaction -> TransactionAndStatus
	console.log("---- Commit transaction");
	client.commitTransaction({transaction : tt}, function(err, result) {
		if(err){
			console.log("Error al conectar");
			return;
		}
		//console.dir(tt);
		console.dir(result);
	*/
	// Transaction -> TransactionAndStatus
	console.log("---- End transaction");
	client.abortTransaction({transaction : tt}, function(err, result) {
		if(err){
			console.log("Error al conectar");
			return;
		}
		//console.dir(tt);
		console.dir(result);
	/*});
	});*/
	});
	});
	});
	});
	/**/
},url);
