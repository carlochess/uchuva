output "Use this link to access to uchuva" {
  value = "http://${digitalocean_record.uchuva.0.fqdn}/"
}

output "controller_address" {
  value = "${digitalocean_droplet.controller.ipv4_address}"
}

output "nodes_addresses" {
  value = ["${digitalocean_droplet.node.*.ipv4_address}"]
}

#output "price_of_controller" {
#  value = "${digitalocean_droplet.controller.price_hourly}"
#}

#output "price_of_nodes" {
#  value = ["${digitalocean_droplet.node.*.price_hourly}"]
#}
