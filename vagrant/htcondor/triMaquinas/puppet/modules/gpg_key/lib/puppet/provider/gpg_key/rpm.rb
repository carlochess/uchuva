Puppet::Type.type(:gpg_key).provide(:rpm) do

  @docs = "GPG Key type provider"

  optional_commands :rpm => "rpm"

  if Facter.fact('operatingsystem').value =~ /Fedora/
    optional_commands :gpg => "gpg2"
  else
    optional_commands :gpg => "gpg" 
  end

  defaultfor :osfamily => :redhat
  confine :osfamily => :redhat

  def installed_gpg_pubkeys
    command = ["rpm", "--query", "--queryformat", "'%{VERSION}\\n'", "gpg-pubkey"].join(" ")
    results = execute(command, :combine => true).split("\n")
    results
  end

  def exists?
    if keyid
      installed_gpg_pubkeys.include?(keyid)
    else
      false
    end
  end

  def create
    rpm(["--import", @resource[:path]].compact)
  end

  def destroy
    rpm(["--erase", "gpg-pubkey-#{keyid}"].compact)
  end

  def keyid
    if File.exist?(@resource[:path])
      gpg(["--quiet", "--throw-keyids", @resource[:path]].compact)[11..18].downcase
    else
      nil
    end
  end
end
