#!/bin/bash
set -e
docker start some-mongo
#if [] then
#   docker run -p 27017:27017 -d --name some-mongo mongo
#fi
firefox localhost:3000 &> /dev/null
npm run devel
