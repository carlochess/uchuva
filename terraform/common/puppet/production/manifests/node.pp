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
group { 'uchuva': ensure => present, gid => 1010,}->
user  { 'uchuva':
  name   => 'uchuva',
  ensure => present,
  groups => 'uchuva',
  shell => '/bin/false',
  uid => 1010,
  gid => 1010,
}->
class { 'firewall': 
    ensure => 'stopped'
}->
package { 'nano':
    ensure => 'installed',
}->
class { '::nfs':
  server_enabled => false,
  client_enabled => true,
  nfs_v4_client => true,
  nfs_v4_idmap_domain => $::domain,
  nfs_v4_export_root_clients => '*(rw,fsid=0,insecure,no_subtree_check,async,no_root_squash)',
}->
nfs::client::mount { '/scratch':
  server => 'controller',
  owner => 'nobody',
  group => 'nobody',
  mode => '777',
}->
class { openlava:
  version => '2.2',
  download_location => '/opt/',
  hostNameList => ['controller','server1','server2'],
}->
class {"condor":
    master => false
}->
class { 'docker':
  docker_users => ['condor','openlava','uchuva'],
  version => '1.11.0-1.el7.centos',#1.12.6-1.el7.centos
}->
exec { "condor restart":
  command => "service condor restart",
  path    => "/usr/bin:/bin:/usr/sbin:/sbin",
  cwd     => "/tmp",
  user    => 'root',
  }

