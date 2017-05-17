variable "do_token" {
    description = "DigitalOcean user api token"
}
variable "do_region" {
    default = "nyc3"
    description = "DigitalOcean region"
}
variable "ssh_public_key" {
   default = "~/.ssh/id_rsa.pub"
   description = "public key location, so it can be installed into new droplets"
}
variable "number_of_nodes" {
   default = 1
   description = "Uchuva number of workers"
}
variable "size_controller" {
    default = "1gb"
}
variable "size_node" {
    default = "1gb"
}
variable "do_image" {
    default = "centos-7-2-x64"
}
variable "domain" {
    description = "Update DigitalOcean A record domain name"
#    default = "diversidadfaunistica.com"
}
