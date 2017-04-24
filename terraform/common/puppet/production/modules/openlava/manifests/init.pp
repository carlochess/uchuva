# == Class: openlava
#
# This module is intended for the automated provisioning and management of
# compute nodes in a RedHat/CentOS based Openlava cluster.
#
#
# === Parameters
#
# [*version*]
#   version of the openlava instalation package.
# [*download_location*]
#   location of the downloaded the package.
# [*openlava_location*]
#   Directory on that will contains openlava
#
# === Examples
#
#  class { openlava:
#    version => '2.0',
#    download_location => '/opt/',
#  }
#
# === Authors
#
# Carlos Ro
#
class openlava (
  $version                = $openlava::params::version,
  $download_location      = $openlava::params::download_location,
  $openlava_location      = $openlava::params::openlava_location,
  $timeout                = $openlava::params::timeout,
  $cpu_cores              = $openlava::params::cpu_cores,
  $ensure                 = $openlava::params::ensure,
  $hostNameList           = $openlava::params::hostNameList,
) inherits openlava::params {
  validate_string($version)
  validate_string($download_location)
  validate_string($openlava_location)
  validate_string($timeout)
  validate_string($cpu_cores)
  validate_string($ensure)
	anchor { '::openlava::begin': }
    -> class { '::openlava::install': } 
    -> class { '::openlava::config': }
    -> class { '::openlava::service': }
    -> anchor { '::openlava::end': }

}
