# == Class: nfs::client
#
# Set up NFS client and mounts. NFSv3 and NFSv4 supported.
#
#
# === Parameters
#
# [nfs_v4]
#   NFSv4 support.
#   Disabled by default.
#
# [nfs_v4_mount_root]
#   Mount root, where we  mount shares, default /srv
#
# [nfs_v4_idmap_domain]
#  Domain setting for idmapd, must be the same across server
#  and clients.
#
#  Default is to use $::domain fact.
#
# === Examples
#
#
#  class { 'nfs::client':
#    nfs_v4              => true,
#    # Generally parameters below have sane defaults.
#    nfs_v4_mount_root  => "/srv",
#    nfs_v4_idmap_domain => $::domain,
#  }
#
#
# === Authors
#
# Harald Skoglund <haraldsk@redpill-linpro.com>
#
# === Copyright
#
# Copyright 2012 Redpill Linpro, unless otherwise noted.
#

class nfs::client (
  $nfs_v4              = $nfs::params::nfs_v4,
  $nfs_v4_mount_root   = $nfs::params::nfs_v4_mount_root,
  $nfs_v4_idmap_domain = $nfs::params::nfs_v4_idmap_domain
) inherits nfs::params {

  class{ "nfs::client::${osfamily}":
    nfs_v4              => $nfs_v4,
    nfs_v4_idmap_domain => $nfs_v4_idmap_domain,
  }

}
