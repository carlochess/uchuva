#!/bin/bash

set -e
set -o pipefail

### Development
# npm install -g node-deb
# sudo apt-get install dpkg fakeroot jq
### Deploy
# sudo apt-get -f install
# sudo dpkg -i uchuva_0.0.1_all.deb
# sudo apt-get -f install
mv ./node_modules ../
node-deb \
  --package-dependencies nodejs-legacy,nodejs,python,build-essential,npm,mongodb \
  --template-default-variables debian/default \
  -- routes tty config.js main.js \
  package.json static utils keys models \
  appframework keys locales worker \
  README.md views
mv ../node_modules ./

### TODO
##https://github.com/heartsucker/node-deb/blob/develop/templates/postinst
#--template-postinst postinst
#--start-command node --demonize main.js
# - Manejo de versiones
