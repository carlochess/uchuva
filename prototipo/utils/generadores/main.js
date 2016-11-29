var fs = require('fs');
var stt = require('swagger-test-templates');
var swagger = require('./api.json');
var config = {
  assertionFormat: 'should',
  testModule: 'supertest',
};

// Generates an array of JavaScript test files following specified configuration
var files = stt.testGen(swagger, config)
files.forEach(function(file){
  fs.writeFile("tests/"+file.name, file.test, function(err) {
	   if(err){
	    console.log(err);
	   }
	});
});

//console.dir([0]);
