Agave HTCondor Container
=======================

This is a vanilla installation of HTCondor configured as a single pool. This configuration is sufficient for running a test server in a development environment, or even debugging job submission scripts, but has not been tested in production settings.

## What is HTCondor?

HTCondor is a specialized workload management system for compute-intensive jobs. Like other full-featured batch systems, HTCondor provides a job queueing mechanism, scheduling policy, priority scheme, resource monitoring, and resource management. Users submit their serial or parallel jobs to HTCondor, HTCondor places them into a queue, chooses when and where to run the jobs based upon a policy, carefully monitors their progress, and ultimately informs the user upon completion.

HTCondor is the product of years of research by the [Center for High Throughput Computing](http://chtc.cs.wisc.edu/) in the Department of Computer Sciences at the University of Wisconsin-Madison (UW-Madison). For more information on the Condor project, please visit the [HTCondor project page](http://research.cs.wisc.edu/htcondor)

## Under the Hood

This image contains the standard test users common to all Agave devops images.

  root:root
  testuser:testuser
  testshareuser:testshareuser
  testotheruser:testotheruser

Additionally, it contains the default `condor` user created during installation.

  condor:condor


## How to use this image

### Starting a HTCondor instance

  > docker run --name htcondor -d agaveapi/htcondor

This image contains an ssh server and HTCondor server which are started by default. The HTCondor server uses a dynamic port. Due to a lack of API access, linking this container does not make much sense.

If you would like to login to the server at runtime, map the exposed port `22`.

  > docker run --name htcondor -p 10022:22 -d agaveapi/htcondor

## Accessing log files

If you would like to persist logging to the local system, you can mount the exposed volume to a local folder

  >  docker run --name htcondor -p 10022:22 -d -v `pwd`:/var/log/condor agaveapi/htcondor

## Testing

  > docker run --name htcondor -d agaveapi/htcondor bash
  bash-4.1# /usr/sbin/condor_master
  bash-4.1# su - testuser -c "condor_submit /etc/condor/test.submit"
  bash-4.1# condor_q

## How to build the image

Build from this directory using the enclosed Dockerfile

  > docker build -rm -t agaveapi/htcondor .
