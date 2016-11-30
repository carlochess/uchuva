# Uchuva - A Scientific web Portal [![Build Status](https://travis-ci.org/carlochess/uchuva.svg?branch=master)](https://travis-ci.org/carlochess/uchuva)
> Currently, under heavy development, keep in touch :)

Uchuva is a scientific web portal that allow users to create workflows and submit
to HTCondor (Dagman), Slurm, OpenLava (LSF), Torque (PBS) and OAR. Is designed to be fast, flexible and simple.
<img align="right" height="260" src="http://4.bp.blogspot.com/-NeOpxs6fQMQ/Tp4ON0TNywI/AAAAAAAAADc/WxEEbycCly4/s1600/aguaymanto.jpg">

## Features
 - A visual editor for workflows
 - A virtual file system
 - A visual command line opts and args library generator
 - Submit workflows to HTCondor (Dagman), Slurm, OpenLava (LSF), Torque (PBS) and OAR.
 - Rest Api with Swagger
 - Vagrant
 - Docker
 - Tested using mocha/chai: unit testing, regression, integration and aceptance test (selenium)
 - Easy to monitor with ELK stack (logger)

> For more information please visit the [wiki](https://github.com/carlochess/uchuva/wiki)

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
Install using [dpkg](https://github.com/carlochess/uchuva/releases)
```
$ apt-get update
$ apt-get install -y git curl sudo python build-essential g++
$ curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
$ sudo apt-get install -y nodejs mongodb
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

#### Ubuntu Linux (32 and 64 bits)
Update and install the essential packages

```
apt-get update
apt-get install -y git curl sudo python make build-essential g++
```

Install [NodeJS 6.9](https://github.com/nodesource/distributions)
```
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs mongodb
```

Clone this repo and install the Node dependencies
```
git clone https://github.com/carlochess/uchuva
cd uchuva/prototipo
npm install
```

> [Install MongoDB](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)

Start uchuva
```
npm start
```

> [Centos 7](https://github.com/carlochess/uchuva/blob/master/vagrant/htcondor/sola/Instrucciones/centos7)

#### Windows

Download The [HTCondor.msi](https://research.cs.wisc.edu/htcondor/downloads/) currently stable release. 
Then you have two choises: manually download and install MongoDB, Nodejs and Git installers 

Or using [Chocolatey](https://chocolatey.org/) package manager, automatically download and install  nodejs, mongodb and git.
```
choco install nodejs.install 
choco install mongodb 
choco install git 
```
> Remember to start [MongoDB Service](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/):

```
md \data\db
"C:\Program Files\MongoDB\Server\3.2\bin\mongod.exe" --dbpath c:\data\db
 ```
 
Open another terminal, clone Uchuva

```
git clone https://github.com/carlochess/uchuva
cd uchuva/prototipo
npm install
npm start
```

And go to the [website](http://127.0.0.1:3000/)

### NPM package
> Isn't working right now
You can install uchuva using a node package manager (npm or yarn)
```
$ npm install -g uchuva
```

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
You can read my bacherlor thesis (Spanish) in the `doc/` folder
![](https://raw.githubusercontent.com/carlochess/uchuva/master/doc/home.png)

## Development 
El prototípo esta programado en Nodejs 6.X (Javascript V8).

## Related projects
Pegasus, Swift parallel scripting language, Dagman, Taverna, Apache airavata, Galaxy, OnlineHPC, Kepler

## Why does my project is call by a super heroe name?
Because i believe that your project would save too many lives and therefore the planet :)

## Disclaimer
 - Thanks to [Colorado Reed's](https://bl.ocks.org/cjrd/6863459) for creating the d3.graph.editor.
 - Also thanks to the creators of Angular file manager
 - Agave project for Torque and Slurm Docker images
 - Puppet for their HTCondor, Mongo, Docker, etc modules
 - Swagger for the api generator
 - TTY.js for such amazing web terminal

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
