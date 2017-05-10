# Terraform Modules

This folder contains modules for Terraform that can setup Consul for various systems. The infrastructure provider that is used is designated by the folder above. See the variables.tf file in each for more documentation.

If you are planning to create more than two nodes, use [Packer](https://www.packer.io/) along with Terraform

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

## Using with docker

docker run -v .:/data --workdir /data hashicorp/terraform plan

## (Optional) Packer

Don't use this, i've no tested yet

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
