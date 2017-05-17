
# Requirements

* Terraform installed
* Digital Ocean account with API key
* SSH key uploaded to Digital Ocean
* A DOMAIN NAME

# Usage

> Remember to create a ssh key pair: ssh-keygen -t rsa

## As-is
$ terraform validate

```
export TF_VAR_do_token=xxxxxxxxx
```
Then get the plan that terraform is going to apply
```
terraform plan
```
If everything is okay, apply it:
```
terraform apply
```

## As a module

module "uchuva" {
  source = "github.com/carlochess/uchuva/terraform/digitalocean"
  do_token        = "DO_TOKEN"
  number_of_nodes = "1"
}

terraform get

# Show information
terraform show
terraform graph | dot -Tpng > graph.png

# Stop and destroy
terraform plan -destroy
terraform destroy

## Trouble
if you already have a key, import it using
```
terraform import digitalocean_ssh_key.default ID
```
To get the id, execute
```
curl -X GET -H "Content-Type: application/json" -H "Authorization: Bearer $TF_VAR_do_token" "https://api.digitalocean.com/v2/account/keys"
```
