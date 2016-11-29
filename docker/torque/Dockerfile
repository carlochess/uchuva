######################################################
#
# Agave DevOps Torque Server
# Tag: agaveapi/torque
#
# This container provides a standard pbs controller
# and worker created on top of the agaveapi/centos-base
# image. Nothing special here.
#
# Usage:
# docker run -h docker -i -rm             \
#            -p 10022:22                  \ # SSHD, SFTP
#            -p 9618:9618                 \ # PBS
#            --privileged
#            agaveapi/torque
#
# https://bitbucket.org/taccaci/agave-environment
#
######################################################

FROM agaveapi/centos-base

MAINTAINER Rion Dooley <dooley@tacc.utexas.edu>

# Install slurm
RUN yum -y --enablerepo=centosplus install make perl-CPAN openssl-devel libxml2-devel boost-devel gcc gcc-c++ git tar libtool vim-minimal

WORKDIR /usr/local

# Pull torque
RUN git clone https://github.com/adaptivecomputing/torque.git -b 5.0.0 5.0.0

WORKDIR /usr/local/5.0.0
RUN ./autogen.sh

# Build Torque
RUN ./configure
RUN make
RUN make install
RUN cp contrib/init.d/trqauthd /etc/init.d/
RUN cp contrib/init.d/pbs_mom /etc/init.d/pbs_mom
RUN cp contrib/init.d/pbs_server /etc/init.d/pbs_server
RUN cp contrib/init.d/pbs_sched /etc/init.d/pbs_sched
RUN ldconfig

# Configure Torque
RUN echo "localhost" > /var/spool/torque/server_name
RUN echo '/usr/local/lib' > /etc/ld.so.conf.d/torque.conf
RUN ldconfig
ENV HOSTNAME localhost

RUN cat /etc/hosts
ADD torque/torque.setup /usr/local/5.0.0/torque.setup
RUN trqauthd start && \
    ./torque.setup root localhost && \
    pbs_mom && pbs_sched && \
    qmgr -c "create queue debug queue_type=execution" && \
    qmgr -c "set queue debug enabled=true" && \
    qmgr -c "set queue debug started=true" && \
    qmgr -c "set server scheduling=True" && \
    qmgr -c 'set queue batch resources_default.walltime = 48:00:00' && \
    qmgr -c 'set queue batch resources_default.nodes = 1' && \
    qmgr -c 'set server default_queue = debug'

RUN echo "localhost np=1" >> /var/spool/torque/server_priv/nodes
RUN echo "docker np=1" >> /var/spool/torque/server_priv/nodes
RUN printf "\$pbsserver localhost" >> /var/spool/torque/mom_priv/config

# Add in a test submit script
ADD torque/torque.submit /home/testuser/torque.submit
RUN chown testuser:testuser /home/testuser/torque.submit

ADD supervisord.conf /etc/supervisord.conf
RUN mkdir /var/log/supervisor
RUN chmod -R 777 /var/log/supervisor

# Add entrypoint script to set the current hostname so the scheduler can communicat
ADD docker_entrypoint.sh /docker_entrypoint.sh

ENTRYPOINT [ "/docker_entrypoint.sh" ]
EXPOSE 10389 22 9618
CMD ["/usr/bin/supervisord"]
