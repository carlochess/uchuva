/*

== Define nfs::client::mount

Set up NFS server and exports. NFSv3 and NFSv4 supported.


=== Parameters

=== Examples

=== Authors

Harald Skoglund <haraldsk@redpill-linpro.com>

=== Copyright

Copyright 2012 Redpill Linpro, unless otherwise noted.

*/

define nfs::client::mount (
  $ensure = 'mounted',
  $server,
  $share,
  $mount = undef,
  $remounts = false,
  $atboot = false,
  $options = '_netdev',
  $bindmount = undef,
  $tag = undef
) {

  include nfs::client


  if $nfs::client::nfs_v4 == true {

    if $mount == undef {
      $_nfs4_mount = "${nfs::client::nfs_v4_mount_root}/${share}"
    } else {
      $_nfs4_mount = $mount
    }

    nfs::mkdir{"${_nfs4_mount}": }

    mount {"shared $share by $::clientcert on ${_nfs4_mount}":
      ensure   => $ensure,
      device   => "${server}:/${share}",
      fstype   => 'nfs4',
      name     => "${_nfs4_mount}",
      options  => $options,
      remounts => $remounts,
      atboot   => $atboot,
      require  => Nfs::Mkdir["${_nfs4_mount}"],
    }


   if $bindmount != undef {
     nfs::client::mount::nfs_v4::bindmount { "${_nfs4_mount}": 
       ensure     => $ensure,
       mount_name => $bindmount,
     }

   }


  } else {

    if $mount == undef {
      $_mount = $share
    } else {
     $_mount = $mount
    }

    nfs::mkdir{"${_mount}": }

    mount {"shared $share by $::clientcert":
      ensure   => $ensure,
      device   => "${server}:${share}",
      fstype   => 'nfs',
      name     => "${_mount}",
      options  => $options,
      remounts => $remounts,
      atboot   => $atboot,
      require  => Nfs::Mkdir["${_mount}"],
    }


  }

}

/*
== Define nfs::client::mount::nfs_v4::root

Mounts the NFSv4 server root.

Don't  use this without configuring a different mount path
if you have several NFS servers.


*/

define nfs::client::mount::nfs_v4::root (
  $ensure = 'mounted',
  $server,
  $mount = undef,
  $remounts = false,
  $atboot = false,
  $options = '_netdev',
  $bindmount = undef,
  $tag = undef
) {

  include nfs::client


  if $mount == undef {
    $_nfs4_mount = "${nfs::client::nfs_v4_mount_root}"
  } else {
    $_nfs4_mount = $mount
  }

  nfs::mkdir{"${_nfs4_mount}": }

  mount {"shared root by $::clientcert on ${_nfs4_mount}":
    ensure   => $ensure,
    device   => "${server}:/",
    fstype   => 'nfs4',
    name     => "${_nfs4_mount}",
    options  => $options,
    remounts => $remounts,
    atboot   => $atboot,
    require  => Nfs::Mkdir["${_nfs4_mount}"],
  }


 if $bindmount != undef {
   nfs::client::mount::nfs_v4::bindmount { "${_nfs4_mount}": 
     ensure     => $ensure,
     mount_name => $bindmount,
   }

 }



}


define nfs::client::mount::nfs_v4::bindmount ( 
  $ensure = 'present',
  $mount_name
  ) {

  nfs::mkdir{"${mount_name}": }

  mount {
    "${mount_name}":
      ensure  => $ensure,
      device  => "${name}",
      atboot  => true,
      fstype  => 'none',
      options => 'bind',
      require => Nfs::Mkdir["${mount_name}"],
  }

}

