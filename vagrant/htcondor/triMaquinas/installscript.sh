#!/usr/bin/env bash
set -e
# Directory in which PuppetFile is placed to be scanned by librarian-puppet.
PUPPET_DIR=/vagrant/puppet
yum install -y git ruby
gem install librarian-puppet
echo "Executing PuppetFile.."
cd $PUPPET_DIR && librarian-puppet install --no-use-v1-api --path modules
