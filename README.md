# Uchuva - A Scientific web Portal
========================================
Uchuva is a scientific web portal that allow users to create workflows and submit
to HTCondor (Dagman), Slurm, OpenLava (LSF), Torque (PBS) and OAR. Is designed to be fast, flexible and simple.

## Features
 - A visual editor for workflows
 - A virtual file system
 - A visual command line opts and args library generator
 - Submit workflows to HTCondor (Dagman), Slurm, OpenLava (LSF), Torque (PBS) and OAR.
 - Rest Api with Swagger
 - Vagrant
 - Docker

## Installing

If you want to try it out as quickly as possible, please install MongoDB, ensure that you have the right compilers installed (for OSX, XCode4 will work, for Ubuntu, the build-essential and libssl-dev packages) and then use Docker:

### Docker
Using Docker to test this project is the better choise you can make. Please, install Docker engine

```
$ curl -fsSL https://get.docker.com/ | sudo sh
$ sudo gpasswd -a ${USER} docker
$ newgrp docker
```
Then Docker-compose
```
$ curl -L "https://github.com/docker/compose/releases/download/1.8.1/docker-compose-$(uname -s)-$(uname -m)" > docker-compose
$ sudo mv docker-compose /usr/local/bin/docker-compose
$ chmod +x /usr/local/bin/docker-compose
$ docker-compose --version
```
And at last, Uchuva
```
$ docker-compose up -d
```
It may take from 10 to 60 minutes to complete (The first time).

You can now visit the host page
```
$ firefox localhost
```

### Vagrant
Go to vagrant/{HTCondor/sola,OpenLava,Torque,Slurm} folder and run
```
$ vagrant up
```
### Native
You also can deploy Uchuva without Docker and Vagrant

Dependencies
  - Node.js
  - MongoDB
  - Git
Optional Deps
  - Git
  - make, g++, curl
  - HTCondor/OpenLava/Torque/Slurm
  - Web browser

#### DEB Linux
Install using dpkg
```
$ apt-get update
$ apt-get install -y git curl sudo python build-essential g++
$ curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
$ sudo apt-get install -y nodejs
$ sudo dpkg -i uchuva_0.0.1_all.deb
$ sudo apt-get -f install
```

All the files for Uchuva install are listed here.
```
/var/lib/uchuva      #contains the binaries
/usr/share/uchuva    #contains the start script
/var/log/uchuva      #contains the agent logs
/etc/default/uchuva  #contains all the environment variables with default values. These variable values can be changed as per requirement
```

#### Linux
Update and install the essential packages

```
apt-get update
apt-get install -y git curl sudo python make build-essential g++
```

Install [NodeJS 6.9](https://github.com/nodesource/distributions)
```
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Clone this repo and install the Node dependencies
```
git clone thisrepo
cd tesis/prototipo
npm install
```

> [Install MongoDB](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)

Start uchuva
```
npm start
```
#### Windows

Download [HTCondor.msi](), [MongoDB.msi](), [NodeJS.msi](), [MongoDB.msi]()
choco install nodejs.install 
choco install mongodb 
choco install git 

choco install docker 
choco install docker-machine 


## Test

```
cd prototipo
npm test
```
## API
You can generate your api client or server from swagger, the spec is saved in `prototipo/static/swagger/api.json`

 - Using the code editor http://editor.swagger.io/
 - Using a code gen from an image: see `prototipo/utils/generadores/generate.sh`

This is an exampĺe
```
require 'swagger_client'

SwaggerClient.configure do |config|
     config.host= "127.0.0.1"
end

apikey = "hzeQHLaKmgg4bdB25Jio"
dagapi   = SwaggerClient::DagApi.new

result = dagapi.user_get(apikey)
puts "Number of dags", result.length
```

## Documentation
You can read my bacherlor thesis cloning the submodule doctesis
```
git submodule foreach git pull origin master
```

## Development 
El prototípo esta programado en Nodejs 6.X (Javascript V8).

## Related projects
Pegasus, Swift parallel scripting language, Dagman, Taverna, Apache airavata, Galaxy, OnlineHPC, Kepler

## Disclaimer
Thanks to [Colorado Reed's](https://bl.ocks.org/cjrd/6863459) for creating such a great tool. Also thanks to the creators of Angular file manager

## Roadmap
 - Add a better text editor
 - Inprove the REST clients examples (ruby for the obvious, groovy for the unmaginable)
 - Use a CI/CD and an Issues reporter
 - Create unit, integration and alfa/beta test
 - Correct the error handling for the rest api
 - Verify the workloader status
 - Allow a workflow choose the workloader
 - Allow a job to execute many times
 - Change the project name
 - Change from remote execution to local execution
 - Add pluggins for the storage: S3, HDFS, FTP, MongoGridFS
 - Add support for windows
 - Add VNC websockify proxy
 - Create more command examples
