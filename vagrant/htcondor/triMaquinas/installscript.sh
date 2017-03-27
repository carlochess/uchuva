#!/usr/bin/env bash
set -e
# Directory in which PuppetFile is placed to be scanned by librarian-puppet.
PUPPET_DIR=/vagrant/puppet
 
echo "Installing Git.."
apt-get -q -y install git
gem install librarian-puppet --version "~>1"
echo "Executing PuppetFile.."
cd $PUPPET_DIR && librarian-puppet install --path modules
