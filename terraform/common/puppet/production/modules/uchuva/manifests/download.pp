class uchuva::download {
  include '::uchuva'
  $uchuvadir = $uchuva::uchuvadir
  package { 'git':
    ensure => 'installed',
  }
  exec {'uchuva download':
    command => "git clone --depth=1 https://github.com/carlochess/uchuva",
    path => ['/usr/bin', '/usr/sbin', '/bin'],
    cwd => "$uchuvadir",
    unless  => "test -d $uchuvadir/uchuva",
    require => Package['git'],
  }
  group { 'uchuva': 
    ensure => present
  }
  user  { 'uchuva':
    name   => 'uchuva',
    ensure => present,
    groups => 'uchuva',
    home => '/home/uchuva/',
    password   => '*',
    shell => '/bin/bash',
    managehome => true,
    require => Group['uchuva'],
  }
  
  file{ '/home/uchuva' :
    ensure=>"directory",
    owner  => 'uchuva',
    group  => 'uchuva',
    mode   => '0750',
    require => User['uchuva'],
  }
  exec {'UchuOwn':
    command => 'chown -R uchuva:uchuva uchuva/',
    path => ['/usr/bin', '/usr/sbin', '/bin'],
    cwd => "$uchuvadir",
    require => File['/home/uchuva'],
  }
  
  ##
  exec {'uchuva update':
    command => "git pull origin master",
    path => ['/usr/bin', '/usr/sbin', '/bin'],
    cwd => "$uchuvadir/uchuva",
    onlyif  => "test -d $uchuvadir/uchuva",
  }
}
