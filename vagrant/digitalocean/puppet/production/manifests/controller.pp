include stdlib
include epel

class { 'firewall': 
    ensure => 'stopped'
}

class {"condor":
    master => true
}

package { 'nano':
    ensure => 'installed',
}

class {'::mongodb::globals':
  manage_package_repo => true,
}->
class {'::mongodb::server': }->

class { '::nodejs':
  nodejs_dev_package_ensure => 'present',
  npm_package_ensure        => 'present',
  repo_class                => '::epel',
}->

package { 'pm2':
  ensure   => 'present',
  provider => 'npm',
}->
## TODO: create the puppet module, use slurm, openlava and torque.
class {"uchuva" :}

#class {'ganglia':
#    controller => true,
#    require => Class['epel']
#}

## Torque https://forge.puppet.com/deric/torque
# mod 'deric-torque', '0.3.0'
# class { 'torque::server': }
# class { 'torque::client': }
## Slurm: https://forge.puppet.com/chwilk/slurm
# mod 'chwilk-slurm', '0.1.0'
