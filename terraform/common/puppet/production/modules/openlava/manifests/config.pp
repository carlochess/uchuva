class openlava::config {
  include '::openlava'
  $openlavaDir = "${openlava::openlava_location}openlava-${openlava::version}"
  $download_location= "${openlava::download_location}openlava-${openlava::version}"
  $hosts = $openlava::hostNameList
  group { 'openlava':
    ensure => 'present',
  }->
  user { 'openlava user':
    name                 => 'openlava',
    ensure               => 'present',
    comment              => 'Openlava workload manager',
    gid                  => 'openlava',
      groups               => ['openlava'],
    home                 => '/home/openlava',
    managehome           => true,
    shell                => '/bin/bash',
  }

  file { "$openlavaDir/etc/lsf.cluster.openlava":
    notify => Service['openlava'],
    ensure => present,
    content => template("${module_name}/lsf.cluster.openlava.config.erb"),
  }

  $files = ['lsb.hosts','lsb.params','lsb.queues','lsb.users','lsf.conf','lsf.shared']
  $files.each |String $s| {
    file { "$openlavaDir/etc/${s}":
      path         => "$openlavaDir/etc/${s}",
      source       => "$download_location/config/${s}",
    }
  }

  exec { "Complementary cp":
    command => "cp $openlavaDir/config/openlava.* $openlavaDir/etc/",
    path    => "/usr/bin:/bin:/usr/sbin:/sbin",
    cwd     => $openlavaDir,
    user    => 'root',
    returns => [ "0", "1", ],
    #unless  => "test -f ${node_symlink_target}",
  }

  exec { "Openlava cp":
    command => "cp $openlavaDir/etc/openlava.* /etc/profile.d/",
    path    => "/usr/bin:/bin:/usr/sbin:/sbin",
    cwd     => $openlavaDir,
    user    => 'root',
    returns => [ "0", "1", ],
    #unless  => "test -f ${node_symlink_target}",
  }

  exec { "Openlava ownership":
    command => "chown -R openlava:openlava $openlavaDir",
    path    => "/usr/bin:/bin:/usr/sbin:/sbin",
    cwd     => $openlavaDir,
    user    => 'root',
    #unless  => "test -f ${node_symlink_target}",
  }


  file { '/etc/init.d/openlava':
    source       => "$openlavaDir/etc/openlava",
    mode => '755'
  }

  exec { "openlava source openlava":
    command => "echo \"[ -f $openlavaDir/etc/openlava.sh ] && source $openlavaDir/etc/openlava.sh\" >> /home/openlava/.bashrc",
    path    => "/usr/bin:/bin:/usr/sbin:/sbin",
    user    => 'root',
  }
  exec { "openlava source root":
    command => "echo \"[ -f $openlavaDir/etc/openlava.sh ] && source $openlavaDir/etc/openlava.sh\" >> /root/.bashrc",
    path    => "/usr/bin:/bin:/usr/sbin:/sbin",
    user    => 'root',
  }
  exec { "root source":
    command => "[ -f $openlavaDir/etc/openlava.sh ] && source $openlavaDir/etc/openlava.sh",
    path    => "/usr/bin:/bin:/usr/sbin:/sbin",
    user    => 'root',
  }

}
