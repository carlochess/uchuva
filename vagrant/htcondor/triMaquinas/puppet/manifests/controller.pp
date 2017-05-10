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
}

#class {'ganglia':
#    controller => true,
#    require => Class['epel']
#}
