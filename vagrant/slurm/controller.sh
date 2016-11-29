apt-get update --fix-missing -m
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
apt-get -y install slurm-llnl munge mpich2 nodejs mongodb
## Configuración
# http://wildflower.diablonet.net/~scaron/slurmsetup.html
#/usr/share/doc/slurm-llnl/slurm-llnl-configurator.easy.html
#/usr/share/doc/slurm-llnl/slurm-llnl-configurator.html

# Info de la máquina
slurmd -C
# Luego se guardan en
cat << 'EOF' > /etc/slurm-llnl/slurm.conf
ClusterName=testing
ControlMachine=controller
SlurmUser=slurm
SlurmdUser=root
SlurmctldPort=6817
SlurmdPort=6818
StateSaveLocation=/var/spool
SlurmdSpoolDir=/var/spool/slurmd
SwitchType=switch/none
MpiDefault=none
SlurmctldPidFile=/var/run/slurmctld.pid
SlurmdPidFile=/var/run/slurmd.pid
ProctrackType=proctrack/pgid
CacheGroups=0
ReturnToService=0
SlurmctldTimeout=300
SlurmdTimeout=300
InactiveLimit=0
MinJobAge=300
KillWait=30
Waittime=0
SchedulerType=sched/backfill
SelectType=select/linear
FastSchedule=1
# LOGGING
SlurmdDebug=3

# LOGGING AND ACCOUNTING
#AccountingStorageEnforce=0
#AccountingStorageHost=localhost
#AccountingStoragePass=d3f@ult$
#AccountingStoragePort=3306
AccountingStorageType=accounting_storage/filetxt
AccountingStorageLoc=/var/log/slurm/accounting
AccountingStorageUser=root
AccountingStoreJobComment=YES
#DebugFlags=
JobCompHost=localhost
JobCompPass=d3f@ult$
JobCompPort=3306
JobCompType=jobcomp/filetxt
JobCompLoc=/var/log/slurm/job_completions
JobCompUser=root
JobAcctGatherFrequency=30
JobAcctGatherType=jobacct_gather/linux

SlurmctldLogFile=/var/log/slurm/slurmctld.log		
SlurmctldDebug=3
SlurmdLogFile=/var/log/slurm/slurmd.log

# COMPUTE NODES
NodeName=server1 Procs=1 State=UNKNOWN
NodeName=server2 Procs=1 State=UNKNOWN
PartitionName=debug Nodes=server1,server2 Default=YES MaxTime=INFINITE State=UP

# BurstBufferType=burst_buffer/generic
EOF

# Se genera la key para mungle
# sudo /usr/sbin/create-munge-key
cp /vagrant/munge.key /etc/munge
chown munge:munge /etc/munge/munge.key
chmod 400 /etc/munge/munge.key

###
sudo chmod g-w /var/log
chown -R munge: /var/log/munge
chown -R munge:munge /var/lib/munge

mkdir /var/run/munge
chown -R munge:munge /var/run/munge
chown -R munge:munge /etc/munge

mkdir /var/log/slurm
touch /var/log/slurm/job_completions
touch /var/log/slurm/accounting
chown -R slurm:slurm /var/log/slurm

touch /var/spool/last_config_lite
touch /var/spool/last_config_lite.new
chown slurm:slurm /var/spool/last_config_lite*

chown root:slurm /var/spool
chmod g+w /var/spool

touch /var/log/slurm/slurmctld.log
chown slurm: /var/log/slurm/slurmctld.log

touch /var/log/slurm/slurmd.log
chown slurm: /var/log/slurm/slurmd.log

#touch /var/log/slurm/slurm_jobacct.log /var/log/slurm/slurm_jobcomp.log
#chown slurm: /var/log/slurm/slurm_jobacct.log /var/log/slurm/slurm_jobcomp.log

# Luego se inician los servicios
/etc/init.d/slurm-llnl start
/etc/init.d/munge start

echo "export SHARE=/vagrant/data" >> /home/vagrant/.bashrc
echo "export BMANAGER=3" >> /home/vagrant/.bashrc
sudo npm install -g nodemon

sudo sed -i "s/localhost/`hostname` localhost/"  /etc/hosts
echo "10.10.10.4 server1" >> /etc/hosts
echo "10.10.10.5 server2" >> /etc/hosts
echo "10.10.10.3 controller" >> /etc/hosts

sudo service slurm-llnl start
#sudo service munge start
#

## Para el master, al iniciar se ejecuta este comando
## sudo slurmctld -D &
