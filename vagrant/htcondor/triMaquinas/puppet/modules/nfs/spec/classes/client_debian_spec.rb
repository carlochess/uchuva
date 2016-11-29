require 'spec_helper'
describe 'nfs::client::debian' do

  it do
    should include_class('nfs::client::debian::install')
    should include_class('nfs::client::debian::configure')
    should include_class('nfs::client::debian::service')

    should contain_service('portmap').with(
      'ensure' => 'running'
    )

    should contain_service('idmapd').with(
      'ensure' => 'stopped'
    )
    should contain_package('nfs-common')
    should contain_package('nfs4-acl-tools')

  end
  context ":nfs_v4 => true" do
    let(:params) {{ :nfs_v4 => true }}
    it do
      should contain_augeas('/etc/idmapd.conf') 
      should contain_service('idmapd').with(
        'ensure' => 'running'
      )
    end
  end

  context ":lsbcodedistname => lucid" do
    let(:facts) { {:lsbdistcodename => 'lucid', } }
    it do
      should contain_package('portmap')
    end
  end
  context "lsbcodedistname => undef" do
    it do
      should contain_package('rpcbind')
    end
  end
end
