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
  text: "Elige un programa"
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
    opciones.append('<select class="form-control.input-lg" id="loadManager" name="loadmanager">'+values+'</select></br>');
    $("#loadManager").val(selectedwl).change();
  }
  $('#plantillaPrograma').hide();
}

aa =false, elementos = [];
var boton = undefined;
var isResizing = false,
    lastDownX = 0;
$(document).ready(function() {
  $('#filem').on('show.bs.modal', function (e) {
    holaMundo =true;
    elementos = [];
    if(graph.state.selectedNode)
      idSeleccionado = graph.state.selectedNode.id;
    boton = e.relatedTarget;
  });
  var container = $('body'),
      right = $('#menu'),
      handle = $('#handle'),
      autohandle = $('#autohandle');

  autohandle.on('click', function (e) {
    var twentyperc = parseInt(container.width() *0.2);
    if(right.css('width') != twentyperc+"px")
      right.css('width', twentyperc);
    else
      right.css('width', 20);
  });

  $('#openMenu').click(function(event) {
    var twentyperc = parseInt(container.width() *0.2);
    if(right.css('width') != twentyperc+"px")
      right.css('width', twentyperc);
    else
      right.css('width', 20);
  });

  handle.on('mousedown', function (e) {
    isResizing = true;
    lastDownX = e.clientX;
  });

  $(document).on('mousemove', function (e) {
    if (!isResizing)
      return;
    var offsetRight = container.width() - (e.clientX - container.offset().left);
    $(".divscroll").css("column-count", parseInt(offsetRight/400)+1);
    right.css('width', offsetRight);
  }).on('mouseup', function (e) {
    isResizing = false;
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
});

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

  $('#mopciones').on('click', '.glyphicon.glyphicon-menu-up',function(ev){
    var elem = $(this).parent();
    cambiarSentido(elem);
  });
  $('#mopciones').on('click', '.glyphicon.glyphicon-menu-down',function(ev){
    var elem = $(this).parent();
    cambiarSentido(elem);
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
