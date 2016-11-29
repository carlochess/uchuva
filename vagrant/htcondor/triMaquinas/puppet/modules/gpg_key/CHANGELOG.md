## treydock-gpg_key changelog

Release notes for the treydock-gpg_key module.

------------------------------------------

#### 2014-05-31 Release 0.0.3

This is a bugfix release to fix running Puppet with --noop when the GPG key file specified using 'path' does not exist.

This release also contains updated development Gem dependencies.

Detailed Changes:

* Only check file's GPG key if file exists
* Minor update to README for clarity - fixes issue #4
* Replace rspec-system tests with beaker-rspec
* Update development Gem dependencies
* Refactor Rake tasks

------------------------------------------

#### 2014-01-03 Release 0.0.2

This is a bugfix release to handle an issue when no gpg-pubkeys exist in RPM database.

Detailed Changes:

* Fix error when no gpg-pubkeys exist in RPM database

------------------------------------------

#### 2013-07-18 Release 0.0.1

* Initial release
