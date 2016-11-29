class nfs::server::redhat(
  $nfs_v4 = false,
  $nfs_v4_idmap_domain = undef
) {

  class{ 'nfs::client::redhat':
    nfs_v4              => $nfs_v4,
    nfs_v4_idmap_domain => $nfs_v4_idmap_domain,
  }

  include nfs::server::redhat::install, nfs::server::redhat::service


}

class nfs::server::redhat::install {

  package { 'nfs4-acl-tools':
    ensure => installed,
  }

}


class nfs::server::redhat::service {

  if nfs::server::redhat::nfs_v4 == true {
      service {"nfs":
        ensure     => running,
        enable     => true,
        hasrestart => true,
        hasstatus  => true,
        require    => Package["nfs-utils"],
        subscribe  => [ Concat['/etc/exports'], Augeas['/etc/idmapd.conf'] ],
      }
    } else {
      service {"nfs":
        ensure     => running,
        enable     => true,
        hasrestart => true,
        hasstatus  => true,
        require    => Package["nfs-utils"],
        subscribe  => Concat['/etc/exports'],
     }
  }
}
