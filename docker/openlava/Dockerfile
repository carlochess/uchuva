FROM 	   ubuntu:14.04
MAINTAINER Carlos Roman <carlochess@gmail.com>

RUN useradd -m "testuser"  && \
    echo "testuser:testuser" | chpasswd
USER testuser
RUN mkdir /home/testuser/.ssh
ADD ssh/id_rsa.pub /home/testuser/.ssh/authorized_keys

USER root
RUN useradd -r openlava

RUN apt-get update --fix-missing
RUN apt-get install -y build-essential wget autoconf libncurses5-dev itcl3-dev supervisor tcl openssh-server && apt-get clean all 

COPY ./openlava-4.0.tar.gz /

RUN tar -xzvf openlava-4.0.tar.gz && cd openlava-4.0/ \
   && ./configure && make && make install

RUN cd openlava-4.0/config && \
   cp lsb.hosts lsb.params lsb.queues lsb.users lsf.cluster.openlava lsf.conf lsf.shared openlava.* /opt/openlava-4.0/etc
   
RUN rm -rf openlava-4.0/

RUN chown -R openlava:openlava /opt/openlava-4.0
RUN cp /opt/openlava-4.0/etc/openlava /etc/init.d
RUN cp /opt/openlava-4.0/etc/openlava.* /etc/profile.d

COPY lsf.cluster.openlava /opt/openlava-4.0/etc/lsf.cluster.openlava

RUN echo "source /opt/openlava-4.0/etc/openlava.sh" >> /root/.bashrc
RUN mkdir -p /home/openlava/
RUN touch /home/openlava/.bashrc

RUN echo "source /opt/openlava-4.0/etc/openlava.sh" >> /home/openlava/.bashrc
RUN echo "source /opt/openlava-4.0/etc/openlava.sh" >> /home/testuser/.bashrc
COPY environment /home/testuser/.ssh/environment
RUN chown -R openlava:openlava /home/openlava/
RUN chown -R testuser:testuser /home/testuser/
RUN mkdir -p /var/run/sshd
RUN sed -ri 's/UsePAM yes/#UsePAM yes/g' /etc/ssh/sshd_config
RUN sed -ri 's/#UsePAM no/UsePAM no/g' /etc/ssh/sshd_config
RUN echo 'PermitUserEnvironment yes' >> /etc/ssh/sshd_config

RUN mkdir -p /var/log/supervisor
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
CMD ["/usr/bin/supervisord"]
EXPOSE 22
#CMD ["service openlava start"]
#ENTRYPOINT service openlava restart
