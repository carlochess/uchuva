class condor ($master = false, $submitter = false) {
    $major_release = "7" #regsubst($::operatingsystemrelease, '^(\d+)\.\d+$', '\1')
        yumrepo { 'htcondor-stable':
            descr => "HTCondor Stable RPM Repository for Redhat Enterprise Linux ${major_release}",
            baseurl => "http://research.cs.wisc.edu/htcondor/yum/stable/rhel${major_release}",
            enabled => 1,
            gpgcheck => 0,
            priority => "99",
            exclude => 'condor.i386, condor.i686',
        }
            
        package { "condor":
            ensure => present,
            require => Yumrepo['htcondor-stable'],
            root => true,
            name    =>  'condor',
        }
    #############

    if $master {
        file { "/etc/condor/config.d/40root.config":
            notify => Service['condor'],
            ensure => present,
            content => template("${module_name}/40root.config.master.erb"),
            require => Package['condor']
        }
        file { "/etc/condor/config.d/21schedd.config":
            notify => Service['condor'],
            ensure => present,
            content => template("${module_name}/21schedd.config.erb"),
            require => Package['condor']
        }
        file { "/etc/condor/config.d/22manager.config":
            notify => Service['condor'],
            ensure => present,
            content => template("${module_name}/22manager.config.erb"),
            require => Package['condor']
        }
    } else {
    	if $submitter {
    		file { "/etc/condor/config.d/40root.config":
		        notify => Service['condor'],
		        ensure => present,
		        content => template("${module_name}/40root.config.submitter.erb"),
		        require => Package['condor']
		    }
    		file { "/etc/condor/config.d/21schedd.config":
		        notify => Service['condor'],
		        ensure => present,
		        content => template("${module_name}/21schedd.config.erb"),
		        require => Package['condor']
		    }
    	
    	} else {
    	
		    file { "/etc/condor/config.d/40root.config":
		        notify => Service['condor'],
		        ensure => present,
		        content => template("${module_name}/40root.config.slave.erb"),
		        require => Package['condor']
		    }
		    file { "/etc/condor/config.d/20worker.config":
		        notify => Service['condor'],
		        ensure => present,
		        content => template("${module_name}/20worker.config.erb"),
		        require => Package['condor']
		    }
		}
    }

    service { "condor" :
        ensure => "running",
        enable => "true",
        require => Package['condor']
    }
}

