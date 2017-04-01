#!/bin/bash
docker start some-mongo
firefox localhost:3000 2>1&
npm run devel
