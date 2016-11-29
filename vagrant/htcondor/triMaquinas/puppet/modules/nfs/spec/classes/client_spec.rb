require 'spec_helper'

describe 'nfs::client' do
  context "operatingsysten => ubuntu" do
    let(:facts) { {:operatingsystem => 'ubuntu', } }
    it { should include_class('nfs::client::debian') }
  end
  context "operatingsysten => debian" do
    let(:facts) { {:operatingsystem => 'debian', } }
    it { should include_class('nfs::client::debian') }
  end
  context "operatingsysten => scientific" do
    let(:facts) { {:operatingsystem => 'scientific', :osmajor => 6 } }
    it { should include_class('nfs::client::redhat') }
  end
  context "operatingsysten => centos v6" do
    let(:facts) { {:operatingsystem => 'centos', :osmajor => 6 } }
    it { should include_class('nfs::client::redhat') }
  end
  context "operatingsysten => redhat v6" do
    let(:facts) { {:operatingsystem => 'redhat', :osmajor => 6 } }
    it { should include_class('nfs::client::redhat') }
  end
end
