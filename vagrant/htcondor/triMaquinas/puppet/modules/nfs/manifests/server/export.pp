define nfs::server::export (
  $v3_export_name = $name,
  $v4_export_name = regsubst($name, '.*/(.*)', '\1' ),
  $clients = 'localhost(ro)',
  $bind = 'rbind',
  # globals for this share 
  # propogated to storeconfigs
  $ensure = 'mounted',
  $mount = undef,
  $remounts = false,
  $atboot = false,
  $options = '_netdev',
  $bindmount = undef,
  $tag = undef
) {


  if $nfs::server::nfs_v4 {

    nfs::server::export::nfs_v4::bindmount {
    "${name}":
      ensure         => $ensure,
      v4_export_name => "${v4_export_name}",
      bind           => $bind,
    }

    nfs::server::export::configure{
      "${nfs::server::nfs_v4_export_root}/${v4_export_name}":
        ensure  => $ensure,
        clients => $clients,
        require => Nfs::Server::Export::Nfs_v4::Bindmount["${name}"]
    }

    @@nfs::client::mount {"shared ${v4_export_name} by ${::clientcert}":
      ensure    => $ensure,
      mount     => $mount,
      remounts  => $remounts,
      atboot    => $atboot,
      options   => $options,
      bindmount => $bindmount,
      tag       => $tag,
      share     => "${v4_export_name}",
      server    => "${::clientcert}",
    }

    } else {

    nfs::server::export::configure{
      "${v3_export_name}":
        ensure  => $ensure,
        clients => $clients,

    }

    @@nfs::client::mount {"shared ${v3_export_name} by ${::clientcert}":
      ensure          => $ensure,
      mount           => $mount,
      remounts        => $remounts,
      atboot          => $atboot,
      options         =>  $options,
      tag             => $tag,
      share           => "${v3_export_name}",
      server          => "${::clientcert}",
    }
  }
}

define nfs::server::export::configure (
  $ensure = 'present',
  $clients
) {

  if $ensure != 'absent' {
    $line = "${name} ${clients}\n"

    concat::fragment{
      "${name}":
        target  => '/etc/exports',
        content => "${line}"
    }
  }
}

define nfs::server::export::nfs_v4::bindmount ( 
  $ensure = 'mounted',
  $bind = $bind,
  $v4_export_name
) {

  $expdir = "${nfs::server::nfs_v4_export_root}/${v4_export_name}"

  nfs::mkdir{"${expdir}": }

  mount {
    "${expdir}":
      ensure  => $ensure,
      device  => "${name}",
      atboot  => true,
      fstype  => 'none',
      options => $bind,
      require => Nfs::Mkdir["${expdir}"],
  }

}

