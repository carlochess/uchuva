# == Class: nfs::server
#
# Set up NFS server and exports. NFSv3 and NFSv4 supported.
#
#
# === Parameters
#
# [nfs_v4]
#   NFSv4 support. Will set up automatic bind mounts to export root.
#   Disabled by default.
#
# [nfs_v4_export_root]
#   Export root, where we bind mount shares, default /export
#
# [nfs_v4_idmap_domain]
#  Domain setting for idmapd, must be the same across server
#  and clients.
#  Default is to use $domain fact.
#
# === Examples
#
#
#  class { nfs::server:
#    nfs_v4                      => true,
#     nfs_v4_export_root_clients => "*.${::domain}(ro,fsid=root,insecure,no_subtree_check,async,root_squash)",
#    # Generally parameters below have sane defaults.
#    nfs_v4_export_root  => "/export",
#    nfs_v4_idmap_domain => $::domain,
#  }
#
# === Authors
#
# Harald Skoglund <haraldsk@redpill-linpro.com>
#
# === Copyright
#
# Copyright 2012 Redpill Linpro, unless otherwise noted.
#

class nfs::server (
  $nfs_v4                       = $nfs::params::nfs_v4,
  $nfs_v4_export_root           = $nfs::params::nfs_v4_export_root,
  $nfs_v4_export_root_clients   = $nfs::params::nfs_v4_export_root_clients,
  $nfs_v4_idmap_domain          = $nfs::params::domain,
  # 
  $nfs_v4_root_export_ensure    = 'mounted',
  $nfs_v4_root_export_mount     = undef,
  $nfs_v4_root_export_remounts  = false,
  $nfs_v4_root_export_atboot    = false,
  $nfs_v4_root_export_options   = '_netdev',
  $nfs_v4_root_export_bindmount = undef,
  $nfs_v4_root_export_tag       = undef
) inherits nfs::params {

  class{ "nfs::server::${osfamily}":
    nfs_v4              => $nfs_v4,
    nfs_v4_idmap_domain => $nfs_v4_idmap_domain,
  }

  include  nfs::server::configure
}

class nfs::server::configure {

  concat {'/etc/exports': 
    require => Class["nfs::server::${nfs::server::osfamily}"]
  }


  concat::fragment{
    'nfs_exports_header':
      target  => '/etc/exports',
      content => "# This file is configured through the nfs::server puppet module\n",
      order   => 01;
  }

  if $nfs::server::nfs_v4 == true {
    include nfs::server::nfs_v4::configure
  }
}

class nfs::server::nfs_v4::configure {

  concat::fragment{
    'nfs_exports_root':
      target  => '/etc/exports',
      content => "${nfs::server::nfs_v4_export_root} ${nfs::server::nfs_v4_export_root_clients}\n",
      order   => 02
  }
  file {
    "${nfs::server::nfs_v4_export_root}":
      ensure => directory,
  }

  @@nfs::client::mount::nfs_v4::root {"shared server root by ${::clientcert}":
    ensure    => $nfs::server::nfs_v4_root_export_ensure,
    mount     => $nfs::server::nfs_v4_root_export_mount,
    remounts  => $nfs::server::nfs_v4_root_export_remounts,
    atboot    => $nfs::server::nfs_v4_root_export_atboot,
    options   => $nfs::server::nfs_v4_root_export_options,
    bindmount => $nfs::server::nfs_v4_root_export_bindmount,
    tag       => $nfs::server::nfs_v4_root_export_tag,
    server    => "${::clientcert}",
  }
}

