sudo add-apt-repository ppa:ubuntu-lxc/lxd-stable


sudo apt-get update
sudo apt-get install -y golang git
cd /vagrant/slurm-https
export PKG_CONFIG_PATH=/tmp/lib/pkgconfig
export GOPATH=$HOME/go
export PATH=$PATH:$GOROOT/bin:$GOPATH/bin
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/tmp/lib
sh .setup.sh
go build
