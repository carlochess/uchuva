# Source code
If you want to install 

```
apt-get update
apt-get install -y git curl sudo python make build-essential g++
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
```

```
git clone https://github.com/carlochess/uchuva
cd tesis/prototipo
npm install
```

```
sudo apt-get update
sudo apt-get install -y mongodb-org
service mongod status
```

```
npm start
```

To generate ssl certs

```
openssl req -nodes -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365
openssl rsa -in key.pem -out newkey.pem && mv newkey.pem key.pem
```
