var plantillas = {};
var cambios = false;
function solicitarPrograma(programa, nombre){
  $.getScript(programa)
    .done(function( script, textStatus ) {
      plantillas[nombre] = window[nombre];
    })
    .fail(function( jqxhr, settings, exception ) {
      console.log("Fracaso: "+exception);
    });
}

$.ajax({
  type: "POST",
  url: "/listarProgramas",
  success: function(data, textStatus, jqXHR){
    data.forEach(function(plantilla) {
      $('#plantillaPrograma').append($('<option>', {
        value: plantilla.name,
        text: plantilla.name
      }));
      solicitarPrograma(plantilla.filename, plantilla.name);
    });
  },
  error: function(jqXHR, textStatus, errorThrown){
    console.log("Fracaso: "+textStatus);
  }
});


$('#plantillaPrograma').append($('<option>', {
  value: "",
  text: ""
}));


$('#menu').on('keyup', '#argss',function(ev){
  var id = graph.state.selectedNode.id;
  graph.nodes[id].configurado.argumento = $(this).val();
  cambios = true;
  ev.stopPropagation();
});

function rederizarArg(param) {
  var opciones = $("#opciones");
  var mopciones = $("#mopciones");
  render(param, document.getElementById("opciones"));
  mopciones.empty();
  mopciones.append('<p>Times</p>');
  var times  = param.times || 1;
  mopciones.append('<li><input type="number" name="times" min="1" id="times" value='+times+'></li>');
  mopciones.append('<p>WorkingDir</p>');
  var wd  = param.wd || "";
  mopciones.append('<li><input type="text" name="wd" id="wd" value="'+wd+'"></li>');
  mopciones.append('<button id="gencmd">Generate command</button>');
  mopciones.append('<p>Files</p>');
  mopciones.append('<button class="nada" data-toggle="modal" data-target=".bs-example-modal-lg">Add files</button>');
  if(param.file && param.file.length > 0){
    param.file.forEach(function(archivo,i){
      if(typeof archivo.entrada === "string"){
        archivo.entrada =  archivo.entrada === "true";
      }
      mopciones.append("<li data-type="+archivo.type+" data-id="+i+">" + archivo.filename +
                      (archivo.entrada? '<span class="glyphicon glyphicon-menu-up" aria-hidden="true"></span>':
                       ' <span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span>') +
                      ' <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>' +" </li>");
    });
  }
}

function rederizarFormulario(nodo, buscado) {
  if (typeof render === 'undefined')
    return;
  $('#plantillaPrograma').show();
  $('#plantillaPrograma').val("").change();
  if(!nodo.configurado && buscado === ""){
    return;
  }
  if (nodo && buscado !== "")
  {
    nodo.configurado = jQuery.extend(true, {}, window[buscado]());
    delete nodo.configurado.validation;
    delete nodo.configurado.transformation;
  }
  $('#plantillaPrograma').val(nodo.configurado.name).change();
  rederizarArg(nodo.configurado);
}

function rederizarProyecto(){
  var opciones = $("#opciones");
  $("#mopciones").empty();
  var selectedwl = workloader;
  if (typeof workloaders != 'undefined'){
    var values = workloaders && workloaders.reduce(function(init, wl){
      return init+'<option value="'+wl+'">'+wl+'</option>';
    },"");
    opciones.append('<li><select id="loadManager" name="loadmanager">'+values+'</select></li></br>');
    $("#loadManager").val(selectedwl).change();
  }
  $('#plantillaPrograma').hide();
}

var abrirMenu = function(event, abrir){
  var $box = $(event.target);
  var cti = event.target.id;
  if(cti !== "menu" && cti !== "openMenu"){
    return;
  }
  var boxName = $box.attr('class');
  var box = {
    offset: $box.offset(),
    pos: $box.position(),
    normal: {
      // excludes padding
      width: $box.width(),
      height: $box.height(),
    },
    inner: {
      // includes padding
      width: $box.innerWidth(),
      height: $box.innerHeight(),
    },
    outer: {
      // includes border
      width: $box.outerWidth(),
      height: $box.outerHeight()
    },
    border: {
      left: parseInt($box.css('border-left-width'), 10),
      right: parseInt($box.css('border-right-width'), 10),
      top: parseInt($box.css('border-top-width'), 10),
      bottom: parseInt($box.css('border-bottom-width'), 10)
    }
  };

  $.extend(box, {
    inner: {
      top: box.offset.top + box.border.top,
      left: box.offset.left + box.border.left,
      right: box.offset.left + box.border.left + box.inner.width,
      bottom: box.offset.top + box.border.top + box.inner.height
    }
  });
  $.extend(box, {
    inner: {
      mouse: {
        top: event.pageY - box.inner.top,
        left: event.pageX - box.inner.left,
        right: event.pageX - box.inner.right,
        bottom: event.pageY - box.inner.bottom
      }
    }
  });
  if (event.type == 'click') {
    if (!(box.inner.mouse.top > 0 &&
          box.inner.mouse.left > 0 &&
          box.inner.mouse.right < 0 &&
          box.inner.mouse.bottom < 0) || abrir) {
      var menu = document.getElementById("menu");
      if (menu.style.right == "0px")
        menu.style.right = "-16em";
      else
        menu.style.right = "0px";
    }
  }
}
$('#openMenu').click(function(event) {
  //event.stopPropagation();
  abrirMenu(event, true);
});


$('#menu').click(function(event) {
  //event.stopPropagation();
  abrirMenu(event, false);
});

aa =false, elementos = [];
var boton = undefined;
$(document).ready(function() {
  $('#filem').on('show.bs.modal', function (e) {
    holaMundo =true;
    elementos = [];
    idSeleccionado = graph.state.selectedNode.id;
    boton = e.relatedTarget;
  });
});

$('#opciones').on('keydown', '#loadManager', function(ev) {
  ev.stopPropagation();
});
$('#mopciones').on('click', '.nada', function(ev) {
  ev.stopPropagation();
  $('#filem').modal('show');
});

$('#opciones').on('change', '#loadManager', function(ev) {
  ev.stopPropagation();
  workloader = $(this).val();
  cambios = true;
});

$("#doc").click(function(){
    startIntro();
})

$(function(){
  function cambiarSentido(elem){
    var idArchivo = elem.data("id");
    var id = graph.state.selectedNode.id;
    var realId = buscar(id);
    graph.nodes[realId].configurado.file[idArchivo].entrada = !graph.nodes[realId].configurado.file[idArchivo].entrada;
    $("#opciones").empty();
    $("#mopciones").empty();
    $('#archivos').val("");
    rederizarFormulario(graph.nodes[realId], "");
    cambios = true;
  }

  $("#back").click(function(){
    if(cambios){
        return confirm("¿Seguro que quieres salir sin guardar?")
    }
    return true;
  });

  /*function atomica(ev){
    ev.stopPropagation();
  }
  var otherOpts = ["#archivos","#wd"];
  otherOpts.forEach(function(opt){
    $('#mopciones').on("keypress",opt, function(ev) {
      atomica(ev);
    });
    $('#mopciones').on("keyup", opt, function(ev) {
      atomica(ev);
    });
    $('#mopciones').on("keydown", opt, function(ev) {
      atomica(ev);
    });
  });*/
  $('#mopciones').on('click', '.glyphicon.glyphicon-menu-up',function(ev){
    var elem = $(this).parent();
    cambiarSentido(elem);
    //ev.stopPropagation();
  });
  $('#mopciones').on('click', '.glyphicon.glyphicon-menu-down',function(ev){
    var elem = $(this).parent();
    cambiarSentido(elem);
    //ev.stopPropagation();
  });
  $('#mopciones').on('click', '.glyphicon.glyphicon-remove',function(ev){
    var elemento = $(this).parent();
    var idArchivo = elemento.data("id");
    var id = graph.state.selectedNode.id;
    var realId = buscar(id);
    graph.nodes[realId].configurado.file.splice(idArchivo,1);
    $("#mopciones").empty();
    $('#archivos').val("");
    rederizarFormulario(graph.nodes[realId], "");
  });
  $('#filemB').on('click', function (e) {
    var pestanna = $("ul#pestanas li.active").text();
    $('#filem').modal('hide');
    holaMundo =false;
    if (pestanna === "Indicar"){
      elementos = $('#archivos').val().split(",");
      elementos = elementos.map(function(o){
        return { model : { name : o.trim() , id : o.trim() , type : "indicado" }} ;
      });
    }
    var id = graph.state.selectedNode.id;
    var realId = buscar(id);

    if(elementos && elementos.length > 0){
      var target = boton;

      var i = 0;
      var corbata = elementos.map(function(o){
	return { filename : o.model.name , id : o.model.id , type : o.model.type , entrada: true };
      });
      graph.nodes[realId].configurado.file = graph.nodes[realId].configurado.file.concat(corbata);
    }

    $("#mopciones").empty();
    $('#archivos').val("");
    rederizarFormulario(graph.nodes[realId], "");
    cambios = true;
  });
  rederizarProyecto();
  fileListener && fileListener.subscribe(function(event) { 
      /*
      graph.nodes
      switch(event.action) {
      case "remove":
          console.log(event.items);
          break;
      case "move":
          console.log(event.items, event.newPath);
          break;
      case "rename":
          console.log(event.item, event.newPath);
          break;
      default:
          console.log("Unknown action")
      }
      var id = graph.state.selectedNode.id;
      var realId = buscar(id);
      rederizarFormulario(graph.nodes[realId], "");
      */
      console.log(event)
  });
});
