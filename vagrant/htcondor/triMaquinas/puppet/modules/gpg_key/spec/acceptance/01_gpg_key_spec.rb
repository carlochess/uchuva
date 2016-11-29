require 'spec_helper_acceptance'

describe 'gpg_key tests:' do
  context "adding gpg key" do
    it "should run successfully" do
      pp = <<-EOS
        file { '/etc/pki/rpm-gpg/RPM-GPG-KEY-EPEL-6':
          ensure  => present,
          source  => 'file:///etc/puppet/modules/gpg_key/spec/fixtures/RPM-GPG-KEY-EPEL-6',
        }
        gpg_key { 'epel':
          path  => '/etc/pki/rpm-gpg/RPM-GPG-KEY-EPEL-6',
        }
      EOS

      apply_manifest(pp, :catch_failures => true)
      apply_manifest(pp, :catch_changes => true)
    end
  end

  context "when no gpg keys present" do
    describe command "rpm -e --allmatches gpg-pubkey-*" do
      it { should return_exit_status 0 }
    end

    it "should run successfully" do
      pp = <<-EOS
        file { '/etc/pki/rpm-gpg/RPM-GPG-KEY-EPEL-6':
          ensure  => present,
          source  => 'file:///etc/puppet/modules/gpg_key/spec/fixtures/RPM-GPG-KEY-EPEL-6',
        }
        gpg_key { 'epel':
          path  => '/etc/pki/rpm-gpg/RPM-GPG-KEY-EPEL-6',
        }
      EOS

      apply_manifest(pp, :catch_failures => true)
      apply_manifest(pp, :catch_changes => true)
    end
  end
end
