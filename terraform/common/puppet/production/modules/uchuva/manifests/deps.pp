class uchuva::deps {
  include '::uchuva'
  $uchuvadir = $uchuva::uchuvadir
  exec {'Uchuinstalldeps':
    command => "npm install",
    path => ['/usr/bin', '/usr/sbin', '/bin'],
    cwd => "$uchuvadir/uchuva/prototipo",
    timeout     => 1800,
  }
}
