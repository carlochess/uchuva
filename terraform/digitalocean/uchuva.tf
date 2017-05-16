provider "digitalocean" {
  token = "${var.do_token}"
}

resource "digitalocean_ssh_key" "default" {
  name       = "SSH public key"
  public_key = "${file(var.ssh_public_key)}"
}

resource "digitalocean_droplet" "controller" {
    name   = "${var.prefix}controller"
    image  = "${var.do_image}"
    region = "${var.do_region}"
    size   = "${var.size_controller}"
    ssh_keys = [
      #"${var.ssh_fingerprint}"
      "${digitalocean_droplet.default.fingerprint}"
    ]

    connection {
        type = "ssh",
        user = "root",
        private_key = "${file(var.ssh_private_key)}"
	timeout = "2m"
    }
    provisioner "file" {
        source      = "${path.module}/../common/scripts/installpuppet.sh"
	destination = "/tmp/installpuppet.sh"
    }
    provisioner "file" {
        source = "${path.module}/../common/puppet"
        destination = "/tmp"
    }
    provisioner "remote-exec" {
   	inline = [
	  "bash /tmp/installpuppet.sh ${digitalocean_droplet.controller.ipv4_address} controller.pp",
	]
    }
}

resource "digitalocean_droplet" "node" {
    name   = "${var.prefix}node${count.index + 1}"
    image  = "${var.do_image}"
    region = "${var.do_region}"
    size   = "${var.size_node}"
    count  = "${var.number_of_nodes}"
    private_networking = true
    ssh_keys = [
      "${var.ssh_fingerprint}"
    ]

    connection {
        type = "ssh",
        user = "root",
        private_key = "${file(var.ssh_private_key)}"
		timeout = "2m"
	}
	provisioner "file" {
		source      = "${path.module}/../common/scripts/installpuppet.sh"
		destination = "/tmp/installpuppet.sh"
	}
	provisioner "file" {
		source = "${path.module}/../common/puppet"
		destination = "/tmp"
	}
	provisioner "remote-exec" {
		inline = [
		  "bash /tmp/installpuppet.sh ${digitalocean_droplet.controller.ipv4_address} node.pp",
		]
	}
}

# (Should be optional) Add a record to the domain
resource "digitalocean_record" "uchuva" {
  domain = "diversidadfaunistica.com"
  type   = "A"
  name   = "uchuva"
  value  = "${digitalocean_droplet.controller.ipv4_address}"
}