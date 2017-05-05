include stdlib
case $::osfamily {
  'RedHat': {
    include epel
  }
  'Debian': {
    include apt
  }
}

include '::ntp'

class { 'firewall':
    ensure => 'stopped'
}->
class { openlava:
  version => '2.2',
  download_location => '/opt/',
  hostNameList => ['controller','server1','server2'],
}->
class {"condor":
    master => true
}->
package { 'nano':
    ensure => 'installed',
}->
file { '/scratch':
  ensure => 'directory',
}->
class { '::nfs':
  server_enabled => true,
}
nfs::server::export { '/scratch':
  ensure  => 'mounted',
  clients => '*(rw,insecure,async,no_root_squash,no_subtree_check)',
  owner => 'nobody',
  group => 'nobody',
  mode => '777',
}->
class {'::mongodb::globals':
  manage_package_repo => true,
  manage_package      => true,
}->
class {'::mongodb::server': }->
class { '::nodejs':
  npm_package_ensure        => 'present',
  /*repo_class                => '::epel',*/
}->
package { 'pm2':
  ensure   => 'present',
  provider => 'npm',
}->
class {"uchuva" :}
->
class { 'nginx': }
nginx::resource::server { 'uchuva.diversidadfaunistica.com':
  listen_port => 80,
  proxy       => 'http://localhost:3000/',
}->
exec { 'setsebool -P httpd_can_network_connect 1':
  path   => '/usr/bin:/usr/sbin:/bin',
}
