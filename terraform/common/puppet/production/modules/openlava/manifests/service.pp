# == Class: openlava::service
#
# This Function exists to
#  1. manage the needed services for openlava
#
class openlava::service {
  include '::openlava'
  exec { "Openlava systemd":
    command => "systemctl enable openlava",
    path    => "/usr/bin:/bin:/usr/sbin:/sbin",
    cwd     => "/opt",
    user    => 'root',
    #unless  => "test -f ${node_symlink_target}",
  }->
  service { "openlava":
    ensure     => true,
    enable     => true,
    hasrestart => true,
    hasstatus  => true
  }
}
