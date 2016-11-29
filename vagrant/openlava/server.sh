apt-get update --fix-missing
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
apt-get install -y build-essential wget autoconf libncurses5-dev itcl3-dev tcl gfortran mpich2
wget http://www.openlava.org/tarball/openlava-4.0.tar.gz

tar -xzvf openlava-4.0.tar.gz
cd openlava-4.0/

./configure
make
make install

cd config
cp lsb.hosts lsb.params lsb.queues lsb.users lsf.cluster.openlava lsf.conf lsf.shared openlava.* /opt/openlava-4.0/etc
   
useradd -r openlava
chown -R openlava:openlava /opt/openlava-4.0
cp /opt/openlava-4.0/etc/openlava /etc/init.d
cp /opt/openlava-4.0/etc/openlava.* /etc/profile.d

###########
## ADD lsf.cluster.openlava /opt/openlava-4.0/etc/
cat << 'EOF' > /opt/openlava-4.0/etc/lsf.cluster.openlava
Begin   ClusterAdmins
Administrators = openlava
End    ClusterAdmins

Begin   Host
HOSTNAME          model          type  server  r1m  RESOURCES
controller              !              !     1       -       -
server1                 !              !     1       -       -
server2                 !              !     1       -       -

End     Host

Begin ResourceMap
RESOURCENAME  LOCATION
End ResourceMap
EOF
###########
echo "source /opt/openlava-4.0/etc/openlava.sh" >> /root/.bashrc
mkdir -p /home/openlava/
touch /home/openlava/.bashrc
echo "source /opt/openlava-4.0/etc/openlava.sh" >> /home/openlava/.bashrc
sudo sed -i "s/localhost/`hostname` localhost/"  /etc/hosts
echo "10.10.10.4 server1" >> /etc/hosts
echo "10.10.10.5 server2" >> /etc/hosts
echo "10.10.10.3 controller" >> /etc/hosts
service openlava start 


