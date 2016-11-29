# Docker
========================================
Docker is an open-source project that automates the deployment of Linux applications inside software containers.

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
