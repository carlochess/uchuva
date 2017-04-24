#!/bin/bash

export PATH=$PATH:/opt/puppetlabs/bin
export PUPPET_DIR=/tmp/puppet/production
controllerIp=$1
type=$2
wget --version &> /dev/null
if [ $? -ne 0 ]; then
   yum install -y wget 
fi
gem -v &> /dev/null
if [ $? -ne 0 ]; then
   yum install -y gem
fi
puppet --version &> /dev/null
if [ $? -ne 0 ]; then
    wget -O - https://raw.githubusercontent.com/petems/puppet-install-shell/master/install_puppet_agent.sh | sudo sh
    echo "export PATH=$PATH:/opt/puppetlabs/bin" > ~/.bashrc
fi

if ! $(gem list librarian-puppet -i); then
    gem install librarian-puppet
fi

cd $PUPPET_DIR && librarian-puppet install --no-use-v1-api --path modules
echo -e "$controllerIp\tcontroller" >> /etc/hosts

export FACTER_domain=diversidadfaunistica.com
puppet apply --modulepath=modules --environment=production manifests/$type
