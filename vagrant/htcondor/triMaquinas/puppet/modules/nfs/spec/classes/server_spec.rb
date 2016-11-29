require 'spec_helper'

describe 'nfs::server' do
    let(:facts) { {:operatingsystem => 'ubuntu', :concat_basedir => '/tmp', } }
    it do
      should contain_concat__fragment('nfs_exports_header').with( 'target' => '/etc/exports' )
    end
    context "nfs_v4 => true" do
      let(:params) { {:nfs_v4 => true, } } 
      it do
        should contain_concat__fragment('nfs_exports_root').with( 'target' => '/etc/exports' )
        should contain_file('/export').with( 'ensure' => 'directory' )
      end
    end

  context "operatingsysten => ubuntu" do
    let(:facts) { {:operatingsystem => 'ubuntu', :concat_basedir => '/tmp', } }
    it { should include_class('nfs::server::debian') }
  end
  context "operatingsysten => debian" do
    let(:facts) { {:operatingsystem => 'debian', :concat_basedir => '/tmp',} }
    it { should include_class('nfs::server::debian') }
  end
  context "operatingsysten => scientific" do
    let(:facts) { {:operatingsystem => 'scientific', :concat_basedir => '/tmp', :osmajor => 6, } }
    it { should include_class('nfs::server::redhat') }
  end
  context "operatingsysten => centos v6" do
    let(:facts) { {:operatingsystem => 'centos', :concat_basedir => '/tmp', :osmajor => 6, } }
    it { should include_class('nfs::server::redhat') }
  end
  context "operatingsysten => redhat v6" do
    let(:facts) { {:operatingsystem => 'redhat', :concat_basedir => '/tmp', :osmajor => 6, } }
    it { should include_class('nfs::server::redhat') }
  end
end
