class nfs::client::debian (
  $nfs_v4 = false,
  $nfs_v4_idmap_domain = undef
) {

  include nfs::client::debian::install,
    nfs::client::debian::configure,
    nfs::client::debian::service

}

class nfs::client::debian::install {

  case $::lsbdistcodename {
    'lucid': {
      package { 'portmap':
        ensure => installed,
      }
    } default: {
      package { 'rpcbind':
        ensure => installed,
      }
    }
  }

  package { ['nfs-common', 'nfs4-acl-tools']:
    ensure => installed,
  }

}
class nfs::client::debian::configure {
  Augeas{
    require => Class['nfs::client::debian::install']
  }

  if $nfs::client::debian::nfs_v4 {
      augeas {
        '/etc/default/nfs-common':
          context => '/files/etc/default/nfs-common',
          changes => [ 'set NEED_IDMAPD yes', ];
        '/etc/idmapd.conf':
          context => '/files/etc/idmapd.conf/General',
          lens    => 'Puppet.lns',
          incl    => '/etc/idmapd.conf',
          changes => ["set Domain ${nfs::client::debian::nfs_v4_idmap_domain}"],
      }
  }

}

class nfs::client::debian::service {

  Service{
    require => Class['nfs::client::debian::configure']
  }

    service { "portmap":
      ensure    => running,
      enable    => true,
      hasstatus => false,
    } 

  if $nfs::client::debian::nfs_v4 {
    service {
      'idmapd':
        ensure => running,
        subscribe => Augeas['/etc/idmapd.conf', '/etc/default/nfs-common'],
    }
  } else {
      service {
        'idmapd':
          ensure => stopped,
      }
  }
}
