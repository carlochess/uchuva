# = Define: openlava::install
#
# == Parameters:
#
class openlava::install() {
  include '::openlava'
  include openlava::pkgs
  
  $version = $openlava::version
  $openlava_unpack_folder = "${openlava::decompress_location}/openlava-${version}"
  $openlava_filename = "openlava-${version}.tar.gz"
  
  if($openlava::url != ""){
    $urlLoc = $openlava::url
  }else{
    $urlLoc = "http://www.openlava.org/tarball/${openlava_filename}"
  }

  if $openlava::ensure == 'true' {
  
    ensure_resource('file', 'decompress_location', {
      ensure => 'directory',
      path   => "${openlava::decompress_location}",
      owner  => 'root',
      group  => 'root',
      mode   => '0644',
    })

    openlava::download { "openlava-download-${version}" :
      source      => $urlLoc,
      destination => "${openlava::download_location}/${openlava_filename}",
      require     => File['decompress_location'],
      timeout     => $openlava::timeout,
    }
    
    ensure_resource('file', 'openlava-unpack-dir', {
      ensure => 'directory',
      path   => "${openlava_unpack_folder}",
      owner  => 'root',
      group  => 'root',
      mode   => '0644',
    })
    
    exec { 'openlava-unpack-${version}':
      command => "tar -xzvf ${openlava::download_location}/${openlava_filename} -C ${openlava_unpack_folder} --strip-components=1",
      path    => '/usr/bin:/bin:/usr/sbin:/sbin',
      cwd     => $::openlava::params::download_location,
      user    => 'root',
      unless  => "test -f ${$openlava_unpack_folder} && test -f ${openlava_unpack_folder}",
      require => [
        ::Openlava::Download["openlava-download-${version}"],
        File['openlava-unpack-dir'],
        Package['tar'],
      ],
    }
    
    exec { 'openlava-make-install-${version}':
      command => './configure && make -j ${cpu_cores} && make -j ${cpu_cores} install',
      path    => "$openlava_unpack_folder:/usr/bin:/bin:/usr/sbin:/sbin",
      cwd     => "$openlava_unpack_folder",
      user    => 'root',
      unless  => "test -f ${openlava_unpack_folder}/Makefile",
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
