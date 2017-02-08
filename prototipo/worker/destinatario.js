var amqp = require('amqplib/callback_api');
var execute = require('./run/submit.js');
var host = "localhost";

amqp.connect('amqp://user:password@'+host, function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = 'task_queue';

    ch.assertQueue(q, {durable: true});
    ch.prefetch(1);
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
    ch.consume(q, function(msg) {
      /*var secs = msg.content.toString().split('.').length - 1;

      console.log(" [x] Received %s", msg.content.toString());
      setTimeout(function() {
	console.log(" [x] Done");
	ch.ack(msg);
      }, secs * 1000);*/
      var dagExeId = msg.content.toString();
      execute.ejecutar(dagExeId, function(){
	console.log("[x] Done");
	ch.ack(msg);
      });
    }, {noAck: false});
  });
});
