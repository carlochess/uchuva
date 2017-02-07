#!/bin/bash

#docker run -d --hostname my-rabbit --name some-rabbit -p 8082:15672 -p 5672:5672 -e RABBITMQ_DEFAULT_USER=user -e RABBITMQ_DEFAULT_PASS=password rabbitmq:3-management-alpine

for i in `seq 1 4`;
do
  node destinatario.js &
done

sleep 2

node remitente.js
