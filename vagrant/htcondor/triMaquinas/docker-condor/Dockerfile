FROM centos:centos6

# Special Thanks to Jim White
# This Image is based of his work
MAINTAINER Duncan Moss <mailto:duncan.moss@sydney.edu.au>

# Set USYD Proxy information
ENV http_proxy http://web-cache.usyd.edu.au:8080
ENV https_proxy https://web-cache.usyd.edu.au:8080

# Add Submitter User
RUN adduser --comment "Condor Submitter" --create-home --shell /bin/bash submit
RUN chmod go+rx /home/submit

# Here I only install tools which we must have:
RUN yum -y install yum-utils wget which
RUN wget http://research.cs.wisc.edu/htcondor/yum/RPM-GPG-KEY-HTCondor
RUN rpm --import RPM-GPG-KEY-HTCondor
RUN yum-config-manager --add-repo https://research.cs.wisc.edu/htcondor/yum/repo.d/htcondor-stable-rhel6.repo
RUN yum -y install condor.x86_64 condor-debuginfo condor-python
RUN yum clean all

ADD condor_config.local /etc/condor/condor_config.local

# Expose Condor Ports
EXPOSE 9618 9886

CMD [ "/bin/bash" ]
