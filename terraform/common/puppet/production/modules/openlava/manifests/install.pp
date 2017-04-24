# = Define: openlava::install
#
# == Parameters:
#
class openlava::install() {
  include '::openlava'

  $version = $openlava::version
  $openlava_unpack_folder = "${openlava::openlava_location}/openlava-${version}"

  if $openlava::ensure == 'true' {
  
    $openlava_filename = "openlava-${::openlava::params::version}.tar.gz"

    ensure_resource('file', 'openlava_location', {
      ensure => 'directory',
      path   => "$::openlava::params::openlava_location/openlava-${version}",
      owner  => 'root',
      group  => 'root',
      mode   => '0644',
    })

    openlava::download { 'openlava-download-${::openlava::params::version}' :
      source      => "http://www.openlava.org/tarball/${openlava_filename}",
      destination => "${openlava::download_location}/${openlava_filename}",
      require     => File['openlava_location'],
      timeout     => $::openlava::params::timeout,
    }->
    file { 'openlava-check-tar-${version}':
      ensure  => 'file',
      path    => "${::openlava::params::openlava_location}/${openlava_filename}",
      owner   => 'root',
      group   => 'root',
      mode    => '0644',
      #require => openlava::download['openlava-download-${::openlava::params::version}'],
    }

    exec { 'openlava-unpack-${version}':
      command => "tar -xzvf ${::openlava::params::openlava_location}/${openlava_filename} -C ${::openlava::params::openlava_location}/openlava-${version} --strip-components=1",
      path    => '/usr/bin:/bin:/usr/sbin:/sbin',
      cwd     => $::openlava::params::download_location,
      user    => 'root',
      unless  => 'test -f ${::openlava::params::openlava_location}/openlava-${version}',
      require => [
        File['openlava-check-tar-${version}'],
        #Package['tar'],
      ],
    }
    include openlava::pkgs
    ## --prefix=${::openlava::params::openlava_location}
    exec { 'openlava-make-install-${version}':
      command => './configure && make -j ${cpu_cores} && make -j ${cpu_cores} install',
      path    => "${::openlava::params::openlava_location}/openlava-${version}:/usr/bin:/bin:/usr/sbin:/sbin",
      cwd     => "$::openlava::params::openlava_location/openlava-${version}",
      user    => 'root',
      #unless  => 'test -f ${node_symlink_target}',
      timeout => 0,
      require => [
        Exec['openlava-unpack-${version}'],
        Class["openlava::pkgs"]
      ],
    }
    notify { 'Starting to compile Openlava version ${version}':
      before  => Exec['openlava-make-install-${version}'],
      require => Exec['openlava-unpack-${version}'],
    }
  } else {
/*
    file { $node_unpack_folder:
      ensure  => absent,
      force   => true,
      recurse => true,
    } ->
    file { '${target_dir}/node-${version}':
      ensure => absent,
    }
*/
  }
}
