# = Define: openlava::instance::pkgs
#
# Ensures that all packages will be installed properly.
#
# == Example:
#
# class { '::openlava::instance::pkgs': }
#
class openlava::pkgs() {
  case $::osfamily {
    'RedHat': {
      $packages = ['tar', 'wget', 'autoconf', 'ncurses-devel', 'tcl', 'tcl-devel', 'psmisc' ]
    }
    'Debian': {
      $packages = ['tar', 'wget', 'autoconf', 'libncurses5-dev', 'itcl3-dev', 'tcl']
    }
  }

  ensure_packages($packages)

  include gcc
  ensure_packages(['make',])
}
