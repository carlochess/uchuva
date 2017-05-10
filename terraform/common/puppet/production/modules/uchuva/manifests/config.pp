class uchuva::config {
  include '::uchuva'
  $uchuvadir = $uchuva::uchuvadir
  ## options as env var
  file { "$uchuvadir/uchuva/prototipo/env":
    ensure => present,
    content => template("${module_name}/env.erb"),
  }
}
