# Terraform and Uchuva

Terraform enable to safely and predictably create, change, and improve production infrastructure. You can use it to deploy Uchuva in the cloud.

> Disclaimer: this readme is oriented towards Digitalocean, feel free to adapt to any other cloud provider or your own cloud.

## Requirements

* Terraform installed
* Digital Ocean account with API key (for DO deployments)
* SSH key uploaded to Digital Ocean
* A DOMAIN NAME (Optional)

## Terraform Modules

This folder contains modules for Terraform that can setup Consul for various systems. The infrastructure provider that is used is designated by the folder above. See the variables.tf file in each for more documentation.

If you are planning to create more than two nodes, use [Packer](#Packer) along with Terraform

```
This is the infraestructure wanted
	                            +------------+
							   /     N      /|
	+------------+            +------------+ |
	| Controller |____________|            | | 
	|            |            |   Node(s)  | |
	+------------+            |            | /
	                          +------------+/
       Public	                  Private

```

## Usage

> Remember to create a ssh key pair: ssh-keygen -t rsa

```
export TF_VAR_do_token=xxxxxxxxx
```

### Workflow
Validate statically if the module is ready for deployment
```
terraform validate
```
Then get the plan that terraform is going to apply
```
terraform plan
```
If everything is okay, apply it:
```
terraform apply
```
Show information
```
terraform show
terraform graph | dot -Tpng > graph.png
```
Stop and destroy
```
terraform plan -destroy
terraform destroy
```

### Using it as a Module

module "uchuva" {
  source = "github.com/carlochess/uchuva/terraform/digitalocean"
  do_token        = "DO_TOKEN"
  number_of_nodes = "1"
}

terraform get

### Using with docker

```
docker run -v .:/data --workdir /data hashicorp/terraform plan
```

## Troubleshoot
if you already have a key, import it using
```
terraform import digitalocean_ssh_key.default ID
```
To get the id, execute
```
curl -X GET -H "Content-Type: application/json" -H "Authorization: Bearer $TF_VAR_do_token" "https://api.digitalocean.com/v2/account/keys"
```

## Todo
 - [ ] Use private the private network
 - [ ] Currently, this module only allows one Node, improve it
 - [ ] Use a DNS to handle nodes hostnames
 - [ ] Use a better aproach to manage SSH keys (CA certs, LAPD or Vault)

## Packer

(Optional)
Please, don't use this because i haven't tested it yet. [Packer](https://www.packer.io/)

```
packer build Packer.json
```

Get the imageID

```
curl -X GET -H "Content-Type: application/json" -H "Authorization: Bearer " /
"https://api.digitalocean.com/v2/snapshots"
```

And feed into terraform

```
terraform apply \
  -var "do_image=imageID"
```

## Notes
> export TF_VAR_ssh_fingerprint=$(ssh-keygen -E MD5 -lf ~/.ssh/id_rsa.pub | awk '{print $2}' | sed 's/MD5://g')
If you are using an older version of OpenSSH (<6.9), replace the last line with
> export TF_VAR_ssh_fingerprint=$(ssh-keygen -lf ~/.ssh/id_rsa.pub | awk '{print $2}')
