require 'puppetlabs_spec_helper/module_spec_helper'

begin
  require 'simplecov'
  require 'coveralls'
  SimpleCov.formatter = Coveralls::SimpleCov::Formatter
  SimpleCov.start do
    add_filter '/spec/'
  end
rescue Exception => e
  warn "Coveralls disabled"
end

RSpec.configure do |config|
  config.before :each do
    Facter.fact(:osfamily).stubs(:value).returns("RedHat")
  end
end

at_exit { RSpec::Puppet::Coverage.report! }
