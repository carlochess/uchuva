      var plantillas = [];

      function solicitarPrograma(programa){
        $.getScript( "/appframework/"+programa+".js" )
          .done(function( script, textStatus ) {
            console.log("loaded",programa);
            plantillas.push(programa);
          })
          .fail(function( jqxhr, settings, exception ) {
            //$( "div.log" ).text( "Triggered ajaxError handler." );
            console.log("Fracaso: "+exception);
        });
      }

      $.ajax({
        type: "POST",
        url: "/listarProgramas",
        success: function(data, textStatus, jqXHR){
            data.forEach(function(plantilla) {
                $('#plantillaPrograma').append($('<option>', {
                          value: plantilla,
                          text: plantilla
                }));
                solicitarPrograma(plantilla);
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
          ev.stopPropagation();
      });

      function rederizarArg(param) {
          var opciones = $("#opciones");
          if(param.raw){
            opciones.append('<li> <textarea id="argss" cols="10" rows="4">'+param.argumento+'</textarea></li></br>"');//
          }else{
            render(param, document.getElementById("opciones"));
          }
          opciones.append('<button class="nada" id="raw">Raw</button>');
          opciones.append('<li><input type="number" name="times" min="1" id="times" value="'+param.times+'"></li></br>"');//
        param.file && param.file.forEach(function(archivo,i){
          if(typeof archivo.entrada === "string"){
            archivo.entrada =  archivo.entrada === "true";
          }
            opciones.append("<li data-type="+archivo.type+" data-id="+i+"> " + archivo.filename +
            (archivo.entrada? ' <span class="glyphicon glyphicon-menu-up" aria-hidden="true"></span>':
            ' <span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span>') +
            ' <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>' +" </li><br/>");
          });
          opciones.append('<button class="nada" data-toggle="modal" data-target=".bs-example-modal-lg">Agregar Archivo</button>');
      }

      function rederizarFormulario(nodo, buscado) {
          if (!nodo.configurado|| buscado !== "")
          {
              nodo.configurado = jQuery.extend(true, {}, window[buscado]());
              delete nodo.configurado.validation;
              delete nodo.configurado.transformation;
          }
          $('#plantillaPrograma').val(buscado);
          rederizarArg(nodo.configurado);
      }

      function rederizarProyecto(){
        var opciones = $("#opciones");
         opciones.append('<li><select id="loadManager" name="loadmanager">'+
           '<option value="htcondor">htcondor</option>'+
           '<option value="torque">torque</option>'+
           '<option value="openlava">openlava</option>'+
           '<option value="slurm">slurm</option>'+
         '</select></li></br>');
        opciones.val(workloader).change();
      }

      $('#menu').click(function(event) {
          event.stopPropagation();
          var $box = $(event.target),
              boxName = $box.attr('class'),
              box = {
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
              if (box.inner.mouse.top > 0 &&
                  box.inner.mouse.left > 0 &&
                  box.inner.mouse.right < 0 &&
                  box.inner.mouse.bottom < 0) {} else {
                  var menu = document.getElementById("menu");
                  if (menu.style.right == "0px")
                      menu.style.right = "-16em";
                  else
                      menu.style.right = "0px";
              }
          }
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
$('#opciones').on('click', '.nada', function(ev) {
    ev.stopPropagation();
    console.log(":D");
    $('#filem').modal('show');
});

$('#opciones').on('change', '#loadManager', function(ev) {
  ev.stopPropagation();
  workloader = $(this).val();
});

$(function(){
  function cambiarSentido(elem){
    var idArchivo = elem.data("id");
    var id = graph.state.selectedNode.id;
    graph.nodes[id].configurado.file[idArchivo].entrada = !graph.nodes[id].configurado.file[idArchivo].entrada;
    $("#opciones").empty();
    $('#archivos').val("");
	rederizarFormulario(graph.nodes[id], "");
  }

  $('#opciones').on('click', '.glyphicon.glyphicon-menu-up',function(ev){
    var elem = $(this).parent();
    cambiarSentido(elem);
    ev.stopPropagation();
  });
  $('#opciones').on('click', '.glyphicon.glyphicon-menu-down',function(ev){
    var elem = $(this).parent();
    cambiarSentido(elem);
    ev.stopPropagation();
  });
  $('#opciones').on('click', '.glyphicon.glyphicon-remove',function(ev){
    var elemento = $(this).parent();
    var idArchivo = elemento.data("id");
    var id = graph.state.selectedNode.id; //idSeleccionado;
    graph.nodes[id].configurado.file.splice(idArchivo,1);
    $("#opciones").empty();
    $('#archivos').val("");
	rederizarFormulario(graph.nodes[id], "");
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
          var id = graph.state.selectedNode.id;//idSeleccionado;

	  if(elementos && elementos.length > 0){
  		var target = boton;

          var i = 0;
          var corbata = elementos.map(function(o){
					return { filename : o.model.name , id : o.model.id , type : o.model.type , entrada: true };
		  });
		  graph.nodes[id].configurado.file = graph.nodes[id].configurado.file.concat(corbata);
      }

      $("#opciones").empty();
      $('#archivos').val("");
	  rederizarFormulario(graph.nodes[id], "");
  });
});
