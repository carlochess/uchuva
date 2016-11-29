# == Class: vagrant
#
# This class is the place to fix minor Vagrant environment issues that may crop
# up with different base boxes.
#
# === Parameters
#
# === Actions
#
# - Ensure docker group exists in order to eliminate the following problem:
#   https://github.com/camptocamp/puppet-java/issues/4
#
# === Requires
#
# === Sample Usage
#
#   class { 'fix': }
#
class fix {

  group { 'docker':
    ensure => present,
  }
  
  #sudo gpasswd -a ${USER} docker
  #sudo gpasswd -a condor docker
  user { 'addusers':
    name => ["vagrant", "condor"]
    groups => ["docker"]
  }
  
  #newgrp docker
  exec { 'remove_templatedir_setting':
    command => 'newgrp docker',
  }
  
  #condor_reconfig
  exec { 'remove_templatedir_setting':
    command => 'condor_reconfig',
  }

}
