# = Define: openlava::install::download
#
# == Parameters:
#
# [*source*]
#   Source to fetch for wget.
#
# [*destination*]
#   Local destination of the file to download.
#
# [*unless_test*]
#   Test whether the destination is already in use.
#
# [*timeout*]
#   Timeout for the download command.
#
define openlava::download(
  $source,
  $destination,
  $unless_test = true,
  $timeout     = 2000
) {
  validate_bool($unless_test)
  validate_string($destination)
  validate_string($source)
  validate_integer($timeout)
  $creates = $unless_test ? {
    true    => $destination,
    default => undef,
  }
  notice("downloading")
  exec { "openlava-wget-download-${source}-${destination}":
    command => "/usr/bin/wget --output-document ${destination} ${source}",
    creates => $creates,
    timeout => $timeout,
    #require => [
    #  Package['wget'],
    #],
  }
}
