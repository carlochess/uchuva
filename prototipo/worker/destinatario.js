var amqp = require('amqplib/callback_api');
var execute = require('./run/submit');
var host = "localhost";

amqp.connect('amqp://user:password@'+host, function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = 'task_queue';

    ch.assertQueue(q, {durable: true});
    ch.prefetch(1);
    console.log(" [*] Esperando un mensaje en la cola %s.", q);
    console.log("Executes.kkk()", execute.kkk());
    ch.consume(q, function(msg) {
     console.log(" [x] Mensaje recibido %s", msg.content.toString());
     var dagExeId = msg.content.toString();
     execute.ejecutar(dagExeId, function(){
       console.log("[x] Termine de procesar");
       ch.ack(msg);
     });
    }, {noAck: false});
  });
});
