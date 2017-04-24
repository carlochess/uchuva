class uchuva () {
  package { 'git':
    ensure => 'installed',
  }->

  exec {'gitclone':
    command => "git clone https://github.com/carlochess/uchuva",
    path => ['/usr/bin', '/usr/sbin', '/bin'],
    cwd => '/usr/local/bin',
    unless  => "test -d '/usr/local/bin/uchuva'",
  }->

  exec {'Uchuinstalldeps':
    command => "npm install",
    path => ['/usr/bin', '/usr/sbin', '/bin'],
    cwd => '/usr/local/bin/uchuva/prototipo'
  }->

  group { 'uchuva': ensure => present, gid => 1010,}->
  user  { 'uchuva':
    name   => 'uchuva',
    ensure => present,
    groups => 'uchuva',
    home => '/home/uchuva/',
    password   => '*',
    shell => '/bin/bash',
    managehome => true,
    uid => 1010,
    gid => 1010,
  }->
  file{ '/home/uchuva' :
    ensure=>"directory",
    owner  => 'uchuva',
    group  => 'uchuva',
    mode   => '0750',
  }->
  exec {'UchuOwn':
    command => 'chown -R uchuva:uchuva uchuva/',
    path => ['/usr/bin', '/usr/sbin', '/bin'],
    cwd => '/usr/local/bin',
  }->
  exec {'UchuStart':
    command => '[ -f /etc/profile.d/openlava.sh ] && source /etc/profile.d/openlava.sh ; pm2 start main.js --name="uchuva"',
    path => ['/usr/bin', '/usr/sbin', '/bin'],
    cwd => '/usr/local/bin/uchuva/prototipo',
    user => 'uchuva',
    environment => ["HOME=/home/uchuva", "SHARE=/scratch"],
  }
}

