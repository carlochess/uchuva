// A WebSocket to TCP socket proxy
// Copyright 2012 Joel Martin
// Licensed under LGPL version 3 (see docs/LICENSE.LGPL-3)
// Requires node modules: ws, optimist and policyfile
//     npm install --save passport.socketio

var net = require('net'),
    url = require('url'),
    path = require('path'),
    //policyfile = require('policyfile'),
    Buffer = require('buffer').Buffer,
    source_host, source_port, target_host, target_port;
var passportSocketIo = require("passport.socketio");

var proxyvnc = function(server,comeGalletas,sessionStore){
	var io = require('socket.io')(server/*,{ handleProtocols: selectProtocol}*/);
		  
	io.use(passportSocketIo.authorize({
		 cookieParser: comeGalletas,      // the same middleware you registrer in express
		 key:          '_id',             // the name of the cookie where express/connect stores its session_id
		 secret:       'keyboard cat',    // the session_secret to parse the cookie
		 store:        sessionStore,      // we NEED to use a sessionstore. no memorystore please
	}));

	// policyfile.createServer().listen(-1, webServer);
	console.log("Listo")
	// Handle new WebSocket client
	var new_client = function(client) {
			console.log("Nuevo usuario")
		  var clientAddr = client._socket.remoteAddress, log;
		  // socket.request.user.logged_in
		  var client = socket.request.user;

		  console.log(client.upgradeReq.url);
		  log = function (msg) {
		      console.log(' ' + clientAddr + ': '+ msg);
		  };
		  log('WebSocket connection');
		  log('Version ' + client.protocolVersion + ', subprotocol: ' + client.protocol);

		  var target = net.createConnection(target_port,target_host, function() {
		      log('connected to target');
		  });
		  target.on('data', function(data) {
		      //log("sending message: " + data);
		      try {
		          if (client.protocol === 'base64') {
		              client.send(new Buffer(data).toString('base64'));
		          } else {
		              client.send(data,{binary: true});
		          }
		      } catch(e) {
		          log("Client closed, cleaning up target");
		          target.end();
		      }
		  });
		  target.on('end', function() {
		      log('target disconnected');
		      client.close();
		  });
		  target.on('error', function() {
		      log('target connection error');
		      target.end();
		      client.close();
		  });

		  client.on('message', function(msg) {
		      //log('got message: ' + msg);
		      if (client.protocol === 'base64') {
		          target.write(new Buffer(msg, 'base64'));
		      } else {
		          target.write(msg,'binary');
		      }
		  });
		  client.on('close', function(code, reason) {
		      log('WebSocket client disconnected: ' + code + ' [' + reason + ']');
		      target.end();
		  });
		  client.on('error', function(a) {
		      log('WebSocket client error: ' + a);
		      target.end();
		  });
	};

	// Select 'binary' or 'base64' subprotocol, preferring 'binary'
	selectProtocol = function(protocols, callback) {
		  if (protocols.indexOf('binary') >= 0) {
		      callback(true, 'binary');
		  } else if (protocols.indexOf('base64') >= 0) {
		      callback(true, 'base64');
		  } else {
		      console.log("Client must support 'binary' or 'base64' protocol");
		      callback(false);
		  }
	}
	
	io.on('connection', new_client);
	//server.listen(3000);
}

module.exports = proxyvnc;
