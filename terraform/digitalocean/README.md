
# Requirements

* Terraform installed
* Digital Ocean account with API key
* SSH key uploaded to Digital Ocean
* A DOMAIN NAME

# Usage

## As-is
$ terraform validate

```
export TF_VAR_do_token=xxxxxxxxx
export TF_VAR_ssh_public_key=$HOME/.ssh/id_rsa.pub
export TF_VAR_ssh_private_key=$HOME/.ssh/id_rsa
export TF_VAR_ssh_fingerprint=$(ssh-keygen -lf ~/.ssh/id_rsa.pub | awk '{print $2}')
```
Then get the plan that terraform is going to apply
```
terraform plan
```
If everything is okay, apply it:
```
terraform apply \
  -var "number_of_nodes=1"
```

## As a module
  
module "uchuva" {
  source = "github.com/carlochess/uchuva/terraform/digitalocean"
  
  do_token        = "DO_TOKEN"
  ssh_public_key  = "$HOME/.ssh/id_rsa.pub"
  ssh_private_key = "$HOME/.ssh/id_rsa"
  ssh_fingerprint = "$SSH_FINGERPRINT"
  number_of_nodes = "3"
}

terraform get

# Show information
terraform show
terraform graph | dot -Tpng > graph.png

# Stop and destroy
terraform plan -destroy
terraform destroy
