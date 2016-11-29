class r {
    case $osfamily {
        'Redhat' : {

            exec { "update-epel":
                command => "/bin/rpm -Uvh http://dl.fedoraproject.org/pub/epel/6/x86_64/epel-release-6-8.noarch.rpm",
                returns => [0,1]
            }

            exec { "yum-upgrade":
                command => "/usr/bin/yum -y upgrade ca-certificates --disablerepo=epel",
                require => Exec["update-epel"]
            }
            package { "R":
                ensure => installed,
                require => Exec["yum-upgrade"]
            }

        }
    }
}
