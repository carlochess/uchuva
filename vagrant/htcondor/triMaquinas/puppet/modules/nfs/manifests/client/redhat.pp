# Shamefully stolen from https://github.com/frimik/puppet-nfs
# refactored a bit
class nfs::client::redhat (
  $nfs_v4 = false,
  $nfs_v4_idmap_domain = undef
) inherits nfs::client::redhat::params {

  include nfs::client::redhat::install, 
    nfs::client::redhat::configure, 
    nfs::client::redhat::service


}
class nfs::client::redhat::install {

  Package {
    before => Class['nfs::client::redhat::configure']
  }
  package { 'nfs-utils':
    ensure => present,
  }

  if $nfs::client::redhat::osmajor == 6 {
    package {'rpcbind':
      ensure => present,
    }
  } elsif $nfs::client::redhat::osmajor == 5 {
    package { 'portmap':
      ensure => present,
    }
  }
}

class nfs::client::redhat::configure {


  if $nfs::client::redhat::nfs_v4 {
    augeas {
      '/etc/idmapd.conf':
        context => '/files/etc/idmapd.conf/General',
        lens    => 'Puppet.lns',
        incl    => '/etc/idmapd.conf',
        changes => ["set Domain ${nfs::client::redhat::nfs_v4_idmap_domain}"],
    }
  }
}

class nfs::client::redhat::service {

  Service {
    require => Class['nfs::client::redhat::configure']
  }

  service {"nfslock":
    ensure     => running,
    enable    => true,
    hasstatus => true,
    require => $nfs::client::redhat::osmajor ? {
      6 => Service["rpcbind"],
      5 => [Package["portmap"], Package["nfs-utils"]]
    },
  }

  service { "netfs":
    enable  => true,
    require => $nfs::client::redhat::osmajor ? {
      6 => Service["nfslock"],
      5 => [Service["portmap"], Service["nfslock"]],
    },
  }

  if $nfs::client::redhat::osmajor == 6 {
    service {"rpcbind":
      ensure    => running,
      enable    => true,
      hasstatus => true,
      require => [Package["rpcbind"], Package["nfs-utils"]],
    }
  } elsif $nfs::client::redhat::osmajor == 5 {
    service { "portmap":
      ensure    => running,
      enable    => true,
      hasstatus => true,
      require => [Package["portmap"], Package["nfs-utils"]],
    }
  }
}

class nfs::client::redhat::params {

  if versioncmp($::operatingsystemrelease, "6.0") > 0 {
    $osmajor = 6
  } elsif versioncmp($::operatingsystemrelease, "5.0") > 0 {
    $osmajor = 5
  }
}


