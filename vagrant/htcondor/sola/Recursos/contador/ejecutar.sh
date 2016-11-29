#!/bin/bash

node split.js
echo {1..4} | xargs -n 1 node contar.js
node final.js
