class uchuva::service {
  include '::uchuva'
  $uchuvadir = $uchuva::uchuvadir
    exec {'UchuStart':
        command => "/bin/bash -c 'source /etc/profile ; source ambiente ; pm2 start main.js --name=\"uchuva\"'",
        path => ['/usr/bin', '/usr/sbin', '/bin'],
        cwd => "$uchuvadir/uchuva/prototipo",
        user => 'uchuva',
        onlyif => 'pm2 id uchuva | grep "\[\]"',
        environment => ["HOME=/home/uchuva"],
   }
   
   exec {'UchuReStart':
        command => "/bin/bash -c 'source /etc/profile ; source ambiente ; pm2 restart --update-env uchuva'",
        path => ['/usr/bin', '/usr/sbin', '/bin'],
        cwd => "$uchuvadir/uchuva/prototipo",
        user => 'uchuva',
        onlyif => 'pm2 id uchuva | grep "\[ 0 \]"',
        environment => ["HOME=/home/uchuva"],
   }
}
