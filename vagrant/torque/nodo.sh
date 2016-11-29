apt-get install -y torque-client torque-mom
service torque-mom stop

echo "controller" > /etc/torque/server_name
# echo $SERVERDOMAIN  | sudo tee   /var/spool/torque/mom_priv/config
#sudo /etc/init.d/torque-mom restart
sudo sed -i "s/localhost/`hostname` localhost/"  /etc/hosts
echo "10.10.10.4 server1" >> /etc/hosts
echo "10.10.10.5 server2" >> /etc/hosts
echo "10.10.10.3 controller" >> /etc/hosts
sleep 10
sudo service torque-mom start
