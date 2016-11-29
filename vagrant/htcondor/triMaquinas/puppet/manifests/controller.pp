include stdlib
include epel

#exec { "actualizar":
#    command => "/usr/bin/yum -y update"
#}

class { 'firewall': 
    ensure => 'stopped'
}

class {'::mongodb::globals':
  manage_package_repo => true,
}->
class {'::mongodb::server': }

class {"condor":
    master => true
}

exec {'nodejs6':
    command => "/usr/bin/curl --silent --location https://rpm.nodesource.com/setup_6.x | sudo bash -"
} -> class { 'nodejs': 
  repo_url_suffix => '6.x',
}

package { 'nano':
    ensure => 'installed',
}

#class {'ganglia':
#    controller => true,
#    require => Class['epel']
#}
