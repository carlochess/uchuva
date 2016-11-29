class ganglia::files ($controller = false) {
    if $controller {
        file { '/etc/ganglia/gmond.conf' :
            owner => 'root',
            group => 'root',
            backup => false,
            mode => '0755',
            require => Class['ganglia::packages'],
            content => template("${module_name}/gmond.conf.controller.erb"),
        }
        
        file { '/etc/ganglia/gmetad.conf' :
            owner => 'root',
            group => 'root',
            backup => false,
            mode => '0755',
            require => Class['ganglia::packages'],
            content => template("${module_name}/gmetad.conf.erb"),
        }
        
        case $::osfamily {
            'Debian' : {
                file { '/etc/apache2/sites-enabled/ganglia.conf' :
                    owner => 'root',
                    group => 'root',
                    backup => false,
                    mode => '0755',
                    require => Class['ganglia::packages'],
                    content => template("${module_name}/ganglia.conf.erb"),
                }
            }
            'RedHat' : {
                file { '/etc/httpd/conf.d/ganglia.conf' :
                    owner => 'root',
                    group => 'root',
                    backup => false,
                    mode => '0755',
                    require => Class['ganglia::packages'],
                    content => template("${module_name}/ganglia.conf.redhat.erb"),
                }
            }
        }
    } else {
        file { '/etc/ganglia/gmond.conf' :
            owner => 'root',
            group => 'root',
            backup => false,
            mode => '0755',
            require => Class['ganglia::packages'],
            content => template("${module_name}/gmond.conf.node.erb"),
        }

    }
}
