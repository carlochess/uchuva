class uchuva::config {
  include '::uchuva'
  $uchuvadir = $uchuva::uchuvadir
  $sharefolder = $uchuva::sharefolder
  $port = $uchuva::port
  $listenaddr = $uchuva::listenaddr
  $mongoaddr = $uchuva::mongoaddr
  ## options as env var
  file { "$uchuvadir/uchuva/prototipo/ambiente":
    ensure => present,
    owner => 'uchuva',
    content => template("${module_name}/env.erb"),
  }
}
