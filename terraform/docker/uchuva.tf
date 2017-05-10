# Configure the Docker provider
provider "docker" {
  #host = "${var.do_host}"
}

resource "docker_container" "controller" {
    name   = "controller"
	image  = "${var.do_image}"
    
	#provisioner "remote-exec" {
	#	inline = [
	#	  "echo ${var.number_of_nodes} > /tmp/uchuva-count",
	#	  "echo ${docker_container.controller.ip_address} > /tmp/controller-addr",
	#	]
	#}
	provisioner "file" {
		source      = "${path.module}/../scripts/hostmanager.sh"
		destination = "/tmp/hostmanager.sh"
	}
}
