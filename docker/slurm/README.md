# Agave DevOps Slurm  Container

This is a development install of the Slurm scheduler running as a controller and worker. This image can be treated like a single node cluster for testing purposes.

## What is Slurm

Slurm is an open-source cluster resource management and job scheduling system that strives to be simple, scalable, portable, fault-tolerant, and interconnect agnostic. SLURM currently has been tested only under Linux.

As a cluster resource manager, SLURM provides three key functions. First, it allocates exclusive and/or non-exclusive access to resources (compute nodes) to users for some duration of time so they can perform work. Second, it provides a framework for starting, executing, and monitoring work (normally a parallel job) on the set of allocated nodes. Finally, it arbitrates conflicting requests for resources by managing a queue of pending work.

For more information on Slurm, consult the official [website](http://slurm.schedmd.com/).

## What's inside

This development container will create an admin user and three users for testing.

  root:root
  testuser:testuser
  testshareuser:testshareuser
  testotheruser:testotheruser

## How to use this image

### To run the container

  > docker run -h docker.example.com \
    -p 10022:22     \ # SSHD, SFTP
    --rm -d --name slurm \
    agaveapi/slurm

This will start the container with a supervisor process which will run a sshd server on exposed port 22 and the Slurm scheduler running as both a controller and worker node.

### To submit jobs

You will need to create an interactive session in order to run jobs in this container. There are two ways to do this.

* First, you can start a container with the default command and ssh in.

  > docker run -h docker.example.com -p 10022:22 --rm -d --name slurm agaveapi/slurm
  > ssh -p 10022 testuser@docker.example.com

* Second, you can run an interactive container and start the services yourself.

  > docker run -h docker.example.com -p 10022:22 --rm -d --name slurm agaveapi/slurm bash
  bash-4.1# /usr/bin/supervisord &

In either situation, once you have a session in the container, you can submit jobs using the `sbatch` command. A test script is included in the image at `/home/testuser/slurm.submit`. You can submit this script to verify the
scheduler is working properly.

  > sbatch /home/testuser/slurm.submit


## How to build the image

Build from this directory using the enclosed Dockerfile

  > docker build -rm -t agaveapi/slurm .
