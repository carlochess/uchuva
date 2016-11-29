include stdlib
include epel

#exec { "actualizar":
#    command => "/usr/bin/yum -y update"
#}

class { 'firewall': 
    ensure => 'stopped'
}

package { 'nano':
    ensure => 'installed',
}

class {"condor":
    master => false
}->
class { 'docker':
  tcp_bind        => ['tcp://0.0.0.0:4243'],
  socket_bind     => 'unix:///var/run/docker.sock',
  docker_users => ['vagrant','condor'],
}

#class {"ganglia":
#    require => Class['epel']
#}

