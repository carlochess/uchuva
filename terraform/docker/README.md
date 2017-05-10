
# Requirements

* Terraform installed

# Variables


# Usage

## As-is
export TF_VAR_do_token= xxxxxxxxx

export SSH_FINGERPRINT=$(ssh-keygen -lf ~/.ssh/id_rsa.pub | awk '{print $2}')

Create the file Terraform/terraform.tfvars that contains your AWS key & secret in this format:

 access_key = "AKXXXXXXXXXXXXXXXXX"
 secret_key = "YYYYYYYYYYYYYYYYYYYYYYYYYYYYYY"

terraform validate

terraform plan \
  -var "do_token=${DO_PAT}" \
  -var "pub_key=$HOME/.ssh/id_rsa.pub" \
  -var "pvt_key=$HOME/.ssh/id_rsa" \
  -var "ssh_fingerprint=$SSH_FINGERPRINT"

terraform apply \
  -var "do_token=${DO_PAT}" \
  -var "pub_key=$HOME/.ssh/id_rsa.pub" \
  -var "pvt_key=$HOME/.ssh/id_rsa" \
  -var "ssh_fingerprint=$SSH_FINGERPRINT"

## As a module
  
module "consul" {
  source = "github.com/hashicorp/consul/terraform/aws"

  key_name = "AWS SSH KEY NAME"
  key_path = "PATH TO ABOVE PRIVATE KEY"
  region   = "us-east-1"
  servers  = "3"
}

terraform get

# Show information
terraform show
terraform graph | dot -Tpng > graph.png

# Stop and destroy
terraform plan -destroy
terraform destroy
