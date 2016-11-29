# Agave DevOps Torque/PBS Container

This is a development install of the Torque scheduler running as a scheduler and worker. This image can be treated like a single node cluster for testing purposes.

## What is Torque

TORQUE Resource Manager provides control over batch jobs and distributed computing resources. It is an advanced open-source product based on the original PBS project* and incorporates the best of both community and professional development. It incorporates significant advances in the areas of scalability, reliability, and functionality and is currently in use at tens of thousands of leading government, academic, and commercial sites throughout the world. TORQUE may be freely used, modified, and distributed under the constraints of the included license.

For more information on Torque, consult the official [website](http://www.adaptivecomputing.com/products/open-source/torque/).

## What's inside

This development container will create an admin user and three users for testing.

  root:root
  testuser:testuser
  testshareuser:testshareuser
  testotheruser:testotheruser

## How to use this image

### To run the container

```
docker run -d -h docker.example.com -p 10022:22 --privileged --name torque agaveapi/torque
```

This will start the container with a supervisor process which will run a sshd server on exposed port 22 and the Torque scheduler running as both a controller and worker node.

    NOTE: You **must** run this image with the `--privileged` flag due to Torque's requirement for unlimited `ulimit` settings.

### To submit jobs

You will need to create an interactive session in order to run jobs in this container. There are two ways to do this.

* First, you can start a container with the default command and ssh in.

```
docker run -h docker.example.com -p 10022:22 -d --name torque --privileged agaveapi/torque    
ssh -p 10022 testuser@docker.example.com
```

* Second, you can run an interactive container and start the services yourself.

```
docker run -h docker.example.com -p 10022:22 -i -t --name torque --privileged agaveapi/torque bash
bash-4.1# /usr/bin/supervisord &
```
In either situation, once you have a session in the container, you can submit jobs using the `qsub` command. A test script is included in the image at `/home/testuser/torque.submit`. You can submit this script to verify the
scheduler is working properly.

```
su - testuser -c 'qsub /home/testuser/torque.submit'
qstat
```

## How to build the image

Build from this directory using the enclosed Dockerfile

    docker build -rm -t agaveapi/torque .
