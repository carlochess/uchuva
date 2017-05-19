function render(programa, node) {
    var i = 0;
    while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
    }
    programa.render.map(function(widget) {
        widget.id = (i++) + "";
        if (typeof(widget) === 'object') {
            if (widget.opciones) {
                return renderizarOpciones(widget);
            } else {
                return renderizarArgumento(widget);
            }
        }
    }).forEach(function(domwidget) {
        node.appendChild(domwidget);
    });
}

function renderizarOpciones(opc) {
    var contenedor = document.createElement("fieldset");
    var programas = document.createElement("select");
    programas.id = opc.id;
    var sumador = document.createElement("label");
    sumador.innerHTML = "+";
    sumador.classList.add('add');
    sumador.dataset.for = opc.id;
    var br = document.createElement("br");
    var id = 0;
    opc.opts.forEach(function(programa) {
        var programadom = document.createElement("option");
        programadom.text = programa.nombroOpt;
        //programadom.id = id++;
        programas.appendChild(programadom);
    });
    contenedor.appendChild(programas);
    contenedor.appendChild(sumador);
    contenedor.appendChild(br);
    var i = 0;
    if(!opc.value)
      opc.value = [];
    opc.value.forEach(function(valor) {
        valor.id = opc.id + "." + i++;
        var opcion = renderizarArgumento(valor);
        var eliminar = document.createElement("label");
        eliminar.innerHTML = "-";
        eliminar.dataset.for = valor.id;
        eliminar.classList.add('remove');
        contenedor.appendChild(eliminar);
        contenedor.appendChild(opcion);
        contenedor.appendChild(br);
    });
    return contenedor;
}

function renderizarArgumento(options) {
    if (!options) {
        options = {};
    }
    var contenedor = document.createElement("fieldset");
    var nombre = document.createElement("label");
    nombre.innerHTML = options.nombroOpt;
    var br = document.createElement("br");
    var multiple;
    if (options.multiple) {
        multiple = document.createElement("label");
        multiple.innerHTML = "+";
        multiple.classList.add('add');
        multiple.dataset.for = options.id;
    }
    contenedor.appendChild(nombre);
    if (options.multiple) {
        contenedor.appendChild(multiple);
    }
    contenedor.appendChild(br);
    var entrada;
    if (options.type === "bool") {
        entrada = document.createElement("input");
        entrada.type = "checkbox";
        entrada.id = options.id;
        if (options.value)
            entrada.checked = options.value;
        contenedor.appendChild(entrada);
    } else if (options.type === "area") {
        entrada = document.createElement("textarea");
        entrada.cols = "50";
        entrada.rows = "10";
        entrada.id = options.id;
        if (options.value)
            entrada.value = options.value;
        else
            entrada.value = "";
        contenedor.appendChild(entrada);
    } else if (options.type === "domain") {
        entrada = document.createElement("select");
        entrada.id = options.id;
        options.domainElems.forEach(function(programa) {
            var programadom = document.createElement("option");
            programadom.text = programa;
            if (programa === options.value)
                programadom.selected = true;
            entrada.appendChild(programadom);
        });
        contenedor.appendChild(entrada);
    } else {
        if (!multiple) {
            entrada = document.createElement("input");
            entrada.id = options.id;
            if (options.value)
                entrada.value = options.value;
            else
                entrada.value = "";
            contenedor.appendChild(entrada);
        } else {
            var i = 0;
            if(!options.value)
              options.value = [];
            options.value.forEach(function(programa) {
                var programadom = document.createElement("input");
                var br = document.createElement("br");
                programadom.id = options.id + "." + i++;
                programadom.value = programa;
                contenedor.appendChild(programadom);
                if (i != 1) {
                    var eliminar = document.createElement("label");
                    eliminar.innerHTML = "-";
                    eliminar.classList.add('remove');
                    eliminar.dataset.for = programadom.id;
                    contenedor.appendChild(eliminar);
                }
                contenedor.appendChild(br);
            });
        }
    }
    return contenedor;
}

function clonar(opt){
    return JSON.parse(JSON.stringify(opt));
}

function accion(ruta, eliminar, nodo) {
    var widget = nodo.configurado.render[parseInt(ruta[0])];
    if (widget.opciones) {
        if (ruta.length == 1) {
            // lvl 1 agregar una opcion, opciones.value.//add(K)
            var nopt = document.getElementById(ruta[0]).selectedIndex;
            var optdom = clonar(nodo.configurado.render[parseInt(ruta[0])].opts[nopt]);
            nodo.configurado.render[parseInt(ruta[0])].value.push(optdom);
        } else if (ruta.length == 2) {
            // lvl 2 eliminar una opcion, agregar dentro de una opcion
            if (eliminar) {
                nodo.configurado.render[parseInt(ruta[0])].value.splice(parseInt(ruta[1]), 1);
            } else {
                nodo.configurado.render[parseInt(ruta[0])].value[parseInt(ruta[1])].value.push("");
            }
        } else if (ruta.length == 3) {
            nodo.configurado.render[parseInt(ruta[0])].value[parseInt(ruta[1])].value.splice(parseInt(ruta[2]), 1);
        }
    } else if (widget.argumento) {
        if (ruta.length == 1) {
            nodo.configurado.render[parseInt(ruta[0])].value.push("");
        } else if (ruta.length == 2) {
            nodo.configurado.render[parseInt(ruta[0])].value.splice(parseInt(ruta[1]), 1);
        }
    } else {
        if (ruta.length == 1) {
            nodo.configurado.render[parseInt(ruta[0])].value.push("");
        } else if (ruta.length == 2) {
            nodo.configurado.render[parseInt(ruta[0])].value.splice(parseInt(ruta[1]), 1);
        }
    }
    render(nodo.configurado,document.getElementById("opciones"))
}

function cambiar(ruta, valor, nodo) {
    var widget = nodo.configurado.render[parseInt(ruta[0])];
    if (widget.opciones) {
        if (ruta.length == 2) {
            widget.value[parseInt(ruta[1])].value = valor;
        } else if (ruta.length == 3) {
            widget.value[parseInt(ruta[1])].value[parseInt(ruta[2])] = valor;
        }
    } else {
        if (ruta.length == 1) {
            nodo.configurado.render[parseInt(ruta[0])].value = valor;
        } else if (ruta.length == 2) {
            nodo.configurado.render[parseInt(ruta[0])].value[parseInt(ruta[1])] = valor;
        }
    }
}
/// Listeners
$('#opciones').on('keydown', 'textarea', function(ev) {
  ev.stopPropagation();
});
$('#opciones').on('keydown', 'input', function(ev) {
  ev.stopPropagation();
});
$('#opciones').on('keyup', 'textarea', function(ev) {
  cambiar($(this).attr('id').split("."), $(this).val(), nodo);
});

$('#opciones').on('keyup', 'input', function(ev) {
  cambiar($(this).attr('id').split("."), $(this).val(), nodo);
});

$('#opciones').on("change", "input:checkbox", function() {
  cambiar($(this).attr('id').split("."), this.checked, nodo);
});

$('#opciones').on('change', 'select', function() {
  cambiar($(this).attr('id').split("."), $(this).val(), nodo);
});

$("#opciones").on("click", "label", function() {
  var cartel = $(this);
  var para = "" + cartel.data('for');
  if (para && para != "undefined") {
    if (cartel.attr('class') === "add") {
      accion(para.split("."), false, nodo);
    } else {
      accion(para.split("."), true, nodo);
    }
  }
});

function display(){
  var config = nodo.configurado;
  var command = document.getElementById("command");
  command.innerHTML = config.location+" " + nodo.configurado.transformation(config.render); // kkk
}
