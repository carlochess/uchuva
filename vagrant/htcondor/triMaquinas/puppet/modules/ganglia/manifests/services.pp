class ganglia::services($controller = false) {

    case $::osfamily {
        'Debian' : {
            service { 'ganglia-monitor':
                ensure => running,
            }

            if $controller {
                service {'gmetad':
                    ensure => running,
                }

                service {'apache2':
                    ensure => running,
                }
            }
        }
        'RedHat' : {
            service { 'gmond':
                ensure => running,
            }

            if $controller {
                service {'gmetad':
                    ensure => running,
                }

                service {'httpd':
                    ensure => running,
                }
            }
        }
    }
}
