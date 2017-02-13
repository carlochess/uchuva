var amqp = require('amqplib/callback_api');
var execute = require('./run/submit');
var logger = console;
var newmask = 0000;
var oldmask = process.umask(newmask);
var throng = require('throng');
var config = require('../config.js');
throng(startWorker);

function startWorker(){
  logger.info("Changed umask from "+
              oldmask.toString(8)+" to "+newmask.toString(8));
  logger.info("This process is pid "+process.pid);
  logger.info("This platform is " + process.platform);
  if (process.getuid) {
    logger.info("Current uid: "+process.getuid());
  }
  if (process.getgid) {
    logger.info("Current gid: "+process.getgid());
  }
  logger.info("Current directory"+process.cwd());

  amqp.connect(config.QUEUE, function(err, conn) {
    conn.createChannel(function(err, ch) {
      var q = 'task_queue';

      ch.assertQueue(q, {durable: true});
      ch.prefetch(1);
      logger.info(" [*] Esperando un mensaje en la cola %s.", q);
      ch.consume(q, function(msg) {
        logger.info(" [x] Mensaje recibido %s", msg.content.toString());
        var dagExeId = msg.content.toString();
        execute.ejecutar(dagExeId, function(){
          logger.info("[x] Termine de procesar");
          ch.ack(msg);
        });
      }, {noAck: false});
    });
    //  basic.reject() Setting requeue to false will cause RabbitMQ to remove
    // the message / basic.nack()
  });
}
