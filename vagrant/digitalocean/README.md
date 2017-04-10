# Getting started
Install vagrant ^1.8.0
Install librarian-puppet

```bash
gem install librarian-puppet
cd /environments/production
librarian-puppet install --no-use-v1-api --path modules
```

Get back to this folder and execute (remember to get your rsa key and a digitalocean Api key w/ read and write permissions)


```
cd ../../
export DOAPI=XXXXXXXXXXX
ssh-keygen -t rsa
vagrant plugin install vagrant-hostmanager
vagrant plugin install vagrant-digitalocean
vagrant up --provider=digital_ocean
vagrant hostmanager --provider=digital_ocean
```
