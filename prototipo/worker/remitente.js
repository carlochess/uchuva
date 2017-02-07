/*queue:
  image: rabbit-mq

npm install amqplib

docker run -d --hostname my-rabbit --name some-rabbit -p 8082:15672 -p 5672:5672 -e RABBITMQ_DEFAULT_USER=user -e RABBITMQ_DEFAULT_PASS=password rabbitmq:3-management-alpine

docker run -d --hostname my-rabbit --name some-rabbit -p 8082:15672 -p 5672:5672 -e RABBITMQ_DEFAULT_USER=user -e RABBITMQ_DEFAULT_PASS=password rabbitmq:3

// http://localhost:8080
// http://container-ip:15672

*/

var amqp = require('amqplib/callback_api');
var host = "localhost";

amqp.connect('amqp://user:password@'+host, function(err, conn) {
    if(err){
	console.log(err);
	process.exit(0);
	return;
    }
    conn.createChannel(function(err, ch) {
	var q = 'task_queue';
	var msg = process.argv.slice(2).join(' ') || "Hello World!";

	ch.assertQueue(q, {durable: true});
	ch.sendToQueue(q, new Buffer(msg), {persistent: true});
	console.log(" [x] Sent '%s'", msg);
    });
    setTimeout(function() { conn.close(); process.exit(0) }, 500);
});
