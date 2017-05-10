output "Use this link to access to uchuva" {
  value = "http://${digitalocean_record.uchuva.fqdn}:3000/"
}

output "controller_address" {
  value = "${digitalocean_droplet.controller.ipv4_address}"
}

output "nodes_addresses" {
  value = ["${digitalocean_droplet.node.*.ipv4_address}"]
}
