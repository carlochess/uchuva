apt-get update --fix-missing
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
apt-get install -y build-essential wget autoconf libncurses5-dev itcl3-dev tcl gfortran mpich2 nodejs mongodb
#VERSION=2.2
VERSION=4.0
cd ~/
#wget http://www.openlava.org/tarball/openlava-${VERSION}.tar.gz
cp /vagrant/openlava-${VERSION}.tar.gz ~
tar -xzvf openlava-${VERSION}.tar.gz
cd openlava-${VERSION}/

./configure
make
make install

cd config
cp lsb.hosts lsb.params lsb.queues lsb.users lsf.cluster.openlava lsf.conf lsf.shared openlava.* /opt/openlava-${VERSION}/etc
   
useradd -r openlava
chown -R openlava:openlava /opt/openlava-${VERSION}
cp /opt/openlava-${VERSION}/etc/openlava /etc/init.d
cp /opt/openlava-${VERSION}/etc/openlava.* /etc/profile.d

###########
## ADD lsf.cluster.openlava /opt/openlava-${VERSION}/etc/
cat << 'EOF' > /opt/openlava-${VERSION}/etc/lsf.cluster.openlava
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
echo "source /opt/openlava-${VERSION}/etc/openlava.sh" >> /root/.bashrc
mkdir -p /home/openlava/
touch /home/openlava/.bashrc
echo "source /opt/openlava-${VERSION}/etc/openlava.sh" >> /home/openlava/.bashrc
sudo sed -i "s/localhost/`hostname` localhost/"  /etc/hosts
echo "10.10.10.4 server1" >> /etc/hosts
echo "10.10.10.5 server2" >> /etc/hosts
echo "10.10.10.3 controller" >> /etc/hosts

echo "export SHARE=/vagrant/data" >> /home/vagrant/.bashrc
echo "export BMANAGER=1" >> /home/vagrant/.bashrc
sudo npm install -g nodemon

service openlava start 


