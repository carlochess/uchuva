# = Define: openlava::install
#
# == Parameters:
#
class openlava::install() {
  include '::openlava'
  
  $version = $openlava::version
  $openlava_unpack_folder = "${::openlava::install_dir}/openlava-${version}"

  if $ensure == present {

    $openlava_filename = "openlava-${::openlava::params::version}.tar.gz""

    ensure_resource('file', 'openlava_location', {
      ensure => 'directory',
      path   => $::openlava::params::openlava_location,
      owner  => 'root',
      group  => 'root',
      mode   => '0644',
    })
	
    ::openlava::instance::download { "openlava-download-${::openlava::params::version}":
      source      => "http://www.openlava.org/tarball/${openlava_filename}",
      destination => "${::openlava::params::download_location}/${openlava_filename}",
      require     => File['openlava_location'],
      timeout     => ${::openlava::params::timeout},
    }

    file { "openlava-check-tar-${version}":
      ensure  => 'file',
      path    => "${::openlava::params::openlava_location}/${openlava_filename}",
      owner   => 'root',
      group   => 'root',
      mode    => '0644',
      require => ::openlava::Instance::Download["openlava-download-${::openlava::params::version}"],
    }

    file { $openlava_unpack_folder:
      ensure  => 'directory',
      owner   => 'root',
      group   => 'root',
      mode    => '0644',
      require => File['openlava-install-dir'],
    }

    exec { "openlava-unpack-${::openlava::params::version}":
      command => "tar -xzvf ${openlava_filename} -C ${::openlava::params::openlava_location} --strip-components=1",
      path    => '/usr/bin:/bin:/usr/sbin:/sbin',
      cwd     => ${::openlava::params::download_location},
      user    => 'root',
      unless  => "test -f ${openlava_symlink_target}",
      require => [
        File["openlava-check-tar-${::openlava::params::version}"],
        File[$openlava_unpack_folder],
        Package['tar'],
      ],
    }

    
      notify { "Starting to compile Openlava version ${version}":
        before  => Exec["openlava-make-install-${version}"],
        require => Exec["openlava-unpack-${version}"],
      }

      exec { "openlava-make-install-${version}":
        command => "./configure --prefix=${::openlava::params::openlava_location} && make -j ${cpu_cores} && make -j ${cpu_cores} install",
        path    => "${::openlava::params::openlava_location}:/usr/bin:/bin:/usr/sbin:/sbin",
        cwd     => ${::openlava::params::openlava_location},
        user    => 'root',
        unless  => "test -f ${node_symlink_target}",
        timeout => 0,
        require => [
          Exec["openlava-unpack-${version}"],
          Class['::gcc'],
          Package['make'],
        ],
      }
	  
  } else {
    if $default_node_version == $version {
      fail('Can\'t remove the instance which is the default instance defined in the ::nodejs class!')
    }

    file { $node_unpack_folder:
      ensure  => absent,
      force   => true,
      recurse => true,
    } ->
    file { "${target_dir}/node-${version}":
      ensure => absent,
    } ->
    file { "${target_dir}/npm-${version}":
      ensure => absent,
    }
  }
}