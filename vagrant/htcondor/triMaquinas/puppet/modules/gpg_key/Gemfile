source "http://rubygems.org"

group :development, :test do
  gem 'rake',                   :require => false
  gem 'rspec-puppet',           :require => false, :git => 'https://github.com/rodjek/rspec-puppet.git'
  gem 'puppetlabs_spec_helper', :require => false
  gem 'puppet-lint',            :require => false
  gem 'puppet-syntax',          :require => false
  gem 'travis-lint',            :require => false
  gem 'simplecov',              :require => false
  gem 'coveralls',              :require => false
end

group :development do
  gem 'beaker', '~> 1.11.0',    :require => false
  gem 'beaker-rspec',           :require => false
  gem 'vagrant-wrapper',        :require => false
end

if puppetversion = ENV['PUPPET_GEM_VERSION']
  gem 'puppet', puppetversion, :require => false
else
  gem 'puppet', '~> 3.5.0', :require => false
end
