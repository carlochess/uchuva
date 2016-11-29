sudo curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y torque-server torque-client torque-mom torque-pam nodejs mongodb
sudo service torque-mom stop
sudo service torque-scheduler stop
sudo service torque-server stop
sudo killall pbs_server
yes y | sudo pbs_server -t create
sudo killall pbs_server

export SERVERDOMAIN=`hostname --fqdn`
echo $SERVERDOMAIN | sudo tee /etc/torque/server_name
echo $SERVERDOMAIN | sudo tee /var/spool/torque/server_priv/acl_svr/acl_hosts
echo root | sudo tee  /var/spool/torque/server_priv/acl_svr/operators
echo root | sudo tee  /var/spool/torque/server_priv/acl_svr/managers

# Luego le decimos al servidor que él mismo es un nodo de computación
# Unimos el servidor de control como uno de procesamiento
echo "$SERVERDOMAIN np=1" | sudo tee /var/spool/torque/server_priv/nodes
#Le decimos a MOM a qué servidor debe contactarse
echo $SERVERDOMAIN | sudo tee /var/spool/torque/mom_priv/config

sudo service torque-server start
sudo service torque-scheduler start
sudo service torque-mom start
# set scheduling properties
sudo qmgr -c 'set server scheduling = true'
sudo qmgr -c 'set server keep_completed = 300'
sudo qmgr -c 'set server mom_job_sync = true'
# create default queue
sudo qmgr -c 'create queue batch'
sudo qmgr -c 'set queue batch queue_type = execution'
sudo qmgr -c 'set queue batch started = true'
sudo qmgr -c 'set queue batch enabled = true'
sudo qmgr -c 'set queue batch resources_default.walltime = 1:00:00'
sudo qmgr -c 'set queue batch resources_default.nodes = 1'
sudo qmgr -c 'set server default_queue = batch'
## Hosts
sudo sed -i "s/localhost/`hostname` localhost/"  /etc/hosts
echo "10.10.10.4 server1" >> /etc/hosts
echo "10.10.10.5 server2" >> /etc/hosts
echo "10.10.10.3 controller" >> /etc/hosts
cat /etc/hosts

# configure submission pool
sudo qmgr -c 'set server submit_hosts = manager'
sudo qmgr -c 'set server allow_node_submit = true'
sudo qmgr -c "create node server1"
sudo qmgr -c "create node server2"

echo "export SHARE=/vagrant/data" >> /home/vagrant/.bashrc
echo "export BMANAGER=2" >> /home/vagrant/.bashrc
sudo npm install -g nodemon


