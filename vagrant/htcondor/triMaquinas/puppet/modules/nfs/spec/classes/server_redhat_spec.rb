require 'spec_helper'
describe 'nfs::server::redhat' do
  let(:facts) { {:osmajor => 6 } }

  it do
    should include_class('nfs::client::redhat')
    should contain_service('nfs').with( 'ensure' => 'running'  )
  end
  context ":nfs_v4 => true" do
    let(:params) {{ :nfs_v4 => true , :nfs_v4_idmap_domain => 'teststring' }}
    it do
      should contain_augeas('/etc/idmapd.conf').with_changes(/set Domain teststring/)
    end

  end
end

