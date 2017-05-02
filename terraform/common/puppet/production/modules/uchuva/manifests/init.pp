class uchuva (
   $uchuvadir = "/usr/local/bin",
   $absent = false,
   $sharefolder = "/scratch",
   $condorjobowner = "uchuva",
   $port = 3000,
   $listenaddr = "http://0.0.0.0/",
   $mongoaddr = "mongodb://localhost/uchuva"
) {
  validate_string($uchuvadir)
  if(!$absent){
      anchor { '::uchuva::begin': }
        -> class { '::uchuva::download': } 
        -> class { '::uchuva::deps': }
        -> class { '::uchuva::config': }
        -> class { '::uchuva::service': }
        -> anchor { '::uchuva::end': }
  }
}

