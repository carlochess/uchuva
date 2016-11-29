require 'spec_helper'

provider_class = Puppet::Type.type(:gpg_key).provider(:rpm)

describe provider_class do
  subject { provider_class }

  before :each do
    @resource = Puppet::Type::Gpg_key.new({:path => '/tmp/path'})
    @provider = provider_class.new(@resource)
    Puppet::Util.stubs(:which).with('rpm').returns('/bin/rpm')
    Puppet::Util.stubs(:which).with('gpg').returns('/usr/bin/gpg')
    subject.stubs(:which).with('rpm').returns('/bin/rpm')
    subject.stubs(:which).with('gpg').returns('/usr/bin/gpg')
  end

  let(:keyid) { '4bd6ec30' }

  let(:gpg_pubkey_list) do
    <<-RPM_OUTPUT
c105b9de
4bd6ec30
0608b895
    RPM_OUTPUT
  end

  let(:gpg_pubkey_array) do
    [
      'c105b9de',
      '4bd6ec30',
      '0608b895',
    ]
  end

  let(:gpg_throw_keyids) { 'pub  4096R/4BD6EC30 2010-07-10 Puppet Labs Release Key (Puppet Labs Release Key) <info@puppetlabs.com>' }

  describe 'installed_gpg_pubkeys' do
    it 'returns array of keys' do
      @provider.stubs(:execute).with("rpm --query --queryformat '%{VERSION}\\n' gpg-pubkey", {:combine => true}).returns(gpg_pubkey_list)
      @provider.installed_gpg_pubkeys.should == gpg_pubkey_array
    end

    it 'returns empty array' do
      @provider.stubs(:execute).with("rpm --query --queryformat '%{VERSION}\\n' gpg-pubkey", {:combine => true}).returns("package gpg-pubkey is not installed")
      @provider.installed_gpg_pubkeys.should == ['package gpg-pubkey is not installed']
    end
  end

  describe 'exists?' do
    it 'check if gpg key exists' do
      @provider.stubs(:keyid).returns(keyid)
      @provider.stubs(:installed_gpg_pubkeys).returns(gpg_pubkey_array)
      @provider.exists?.should be_true
    end

    it 'check if gpg key does not exist' do
      @provider.stubs(:keyid).returns('foo')
      @provider.stubs(:installed_gpg_pubkeys).returns(gpg_pubkey_array)
      @provider.exists?.should be_false
    end

    it 'should be false if keyid is nil' do
      @provider.stubs(:keyid).returns(nil)
      @provider.exists?.should be_false
    end
  end

  describe 'create' do
    it 'imports a GPG key' do
      subject.expects(:rpm).with(["--import", "#{@resource[:path]}"])
      @provider.create
    end
  end

  describe 'destroy' do
    before :each do
      @resource = Puppet::Type::Gpg_key.new({:ensure => :absent, :path => '/tmp/path'})
    end

    it 'erase a GPG key' do
      @provider.stubs(:keyid).returns(keyid)
      subject.expects(:rpm).with(["--erase", "gpg-pubkey-#{keyid}"])
      @provider.destroy
    end
  end

  describe 'keyid' do
    it 'return keyid used by RPM' do
      File.stubs(:exist?).with(@resource[:path]).returns(true)
      subject.expects(:gpg).with(["--quiet", "--throw-keyids", @resource[:path]]).returns(gpg_throw_keyids)
      @provider.keyid.should == keyid
    end

    it 'return nil if path does not exist' do
      File.stubs(:exist?).with(@resource[:path]).returns(false)
      @provider.keyid.should be_nil
    end
  end
end
