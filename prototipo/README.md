apt-get update
apt-get install -y git curl sudo python make build-essential g++

curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs

git clone git@diversidadfaunistica.com:tesis.git
cd tesis/prototipo
npm install

//14
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
//16
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
//14
echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list
//16
echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list

sudo apt-get update
sudo apt-get install -y mongodb-org
service mongod status

Unit file
sudo nano /etc/systemd/system/mongodb.service
[Unit]
Description=High-performance, schema-free document-oriented database
After=network.target

[Service]
User=mongodb
ExecStart=/usr/bin/mongod --quiet --config /etc/mongod.conf

[Install]
WantedBy=multi-user.target

sudo systemctl start mongodb
sudo systemctl status mongodb

npm start

---

Descargar Condor.msi

