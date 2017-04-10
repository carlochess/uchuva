#!/usr/bin/env bash
#set -e
# Directory in which PuppetFile is placed to be scanned by librarian-puppet.
PUPPET_DIR=/vagrant/puppet/production
sudo rpm -ivh http://yum.puppetlabs.com/puppetlabs-release-el-7.noarch.rpm
yum install -y git ruby puppet
#gem install librarian-puppet
#echo "Executing PuppetFile.."
#cd $PUPPET_DIR && librarian-puppet install --no-use-v1-api --path modules
