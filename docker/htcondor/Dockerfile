# Dockerizing HTCondor submit node
# Based on debian:wheezy, installs HTCondor following the instructions from:
# https://research.cs.wisc.edu/htcondor/debian/

FROM 	   ubuntu:14.04
MAINTAINER Riccardo Bucchi <riccardo.bucchi26@gmail.com>
ENV 	   TINI_VERSION v0.9.0

ADD     https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /sbin/tini
RUN	set -ex \
	# CONDOR
	&& apt-get update && apt-get install -y wget procps \
	&& chmod +x /sbin/tini \
	&& echo "deb http://research.cs.wisc.edu/htcondor/ubuntu/stable/ trusty contrib" >> /etc/apt/sources.list \
	&& wget -qO - http://research.cs.wisc.edu/htcondor/ubuntu/HTCondor-Release.gpg.key | apt-key add - \
        && export DEBIAN_FRONTEND=noninteractive \
	&& apt-get update \
	&& apt-get install condor -y --force-yes \
 	&& apt-get install -y  openssh-server python-pip && pip install supervisor supervisor-stdout \
	# CLEAN
	&& apt-get -y remove wget python-pip \
        && apt-get clean all
COPY 	supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY    condor_config /etc/condor/condor_config
RUN chmod 777 /etc/condor/condor_config
COPY    run.sh /usr/local/sbin/run.sh
RUN chmod 777 /usr/local/sbin/run.sh

RUN useradd -m "testuser"  && \
    echo "testuser:testuser" | chpasswd

USER testuser
RUN mkdir /home/testuser/.ssh
ADD ssh/id_rsa.pub /home/testuser/.ssh/authorized_keys
USER root

RUN chown -R testuser:testuser /home/testuser/
RUN mkdir -p /var/run/sshd
RUN sed -ri 's/UsePAM yes/#UsePAM yes/g' /etc/ssh/sshd_config
RUN sed -ri 's/#UsePAM no/UsePAM no/g' /etc/ssh/sshd_config
RUN echo 'PermitUserEnvironment yes' >> /etc/ssh/sshd_config
RUN mkdir -p /var/log/supervisor

RUN /bin/date

RUN useradd -ms /bin/bash uchuva
RUN gpasswd -a uchuva condor
RUN newgrp condor
EXPOSE 22
ENTRYPOINT ["/sbin/tini", "--", "/usr/local/sbin/run.sh"]
