require 'spec_helper'

describe Puppet::Type.type(:gpg_key) do
  let :gpg_key do
    Puppet::Type.type(:gpg_key).new(:title => 'foo', :path => '/tmp/path')
  end

  it 'should accept a title and path' do
    gpg_key.title = 'foo'
    gpg_key.title.should == 'foo'
    gpg_key[:path] = '/tmp/gpg.key'
    gpg_key[:path].should == '/tmp/gpg.key'
  end

  it 'should accept fully qualified paths' do
    gpg_key[:path] = '/tmp/gpg.key'
    gpg_key[:path].should == '/tmp/gpg.key'
  end

  it 'should not accept unqualified paths' do
    expect { gpg_key[:path] = 'gpg.key' }.to raise_error(Puppet::Error, /File paths must be fully qualified/)
    expect { gpg_key[:path] = './gpg.key' }.to raise_error(Puppet::Error, /File paths must be fully qualified/)
    expect { gpg_key[:path] = '~/gpg.key' }.to raise_error(Puppet::Error, /File paths must be fully qualified/)
  end

  it 'should accept posix filename as name' do
    gpg_key[:name] = '/tmp/gpg.key'
    gpg_key[:name].should == '/tmp/gpg.key'
  end

  it 'should accept posix filename as title' do
    gpg_key.title = '/tmp/gpg.key'
    gpg_key.title.should == '/tmp/gpg.key'
  end

  it 'should default to ensure => present' do
    gpg_key[:ensure].should eq :present
  end

  it 'should accept ensure => absent' do
    gpg_key[:ensure] = :absent
    gpg_key[:ensure].should eq :absent
  end

  it 'should not accept ensure => somevalue' do
    expect { gpg_key[:ensure] = :somevalue }.to raise_error(Puppet::Error, /Valid values are present, absent/)
  end

  it 'should autorequire the file it manages' do
    catalog = Puppet::Resource::Catalog.new
    file = Puppet::Type.type(:file).new(:name => '/tmp/path')
    catalog.add_resource file
    catalog.add_resource gpg_key

    relationship = gpg_key.autorequire.find do |rel|
      (rel.source.to_s == 'File[/tmp/path]') and (rel.target.to_s == gpg_key.to_s)
    end
    relationship.should be_a Puppet::Relationship
  end

  it 'should not autorequire the file it manages if it is not managed' do
    catalog = Puppet::Resource::Catalog.new
    catalog.add_resource gpg_key
    gpg_key.autorequire.should be_empty
  end
end
