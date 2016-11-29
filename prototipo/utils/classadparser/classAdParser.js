
function classAdToJson(data){
  str = borrarComentarios(data)

  return extraerEntreBarras(str)
}

function borrarComentarios(str){
    do{
        var inicioComentario = str.indexOf("/*")
        if(inicioComentario == -1) break;
        var finComentario = str.indexOf("*/")
        str = str.substring(0,inicioComentario) +str.substring(finComentario+2,str.length)
    }while(true)
    return str
}

function extraerEntreBarras(str){
    var ca = {}
    do{
        var inicioComentario = str.indexOf("[")
        if(inicioComentario == -1) break;
        var finComentario = str.indexOf("]")
        var amm = str.substring(inicioComentario+1,finComentario)
        ca = classAd(amm, ca)
        str = str.substring(0,inicioComentario) +str.substring(finComentario+1,str.length)
    }while(true)
    return ca;
}

function classAd(str, gca){
    var ca = {}
    var classes = str.split(";")
    var id = "",fail = ""
    for(var i=0; i<classes.length ; i++){
        if(classes[i].indexOf("=") !=-1){
            var clase = classes[i].split("=")
            ca[clase[0].trim()] = clase[1].trim()
        }
    }
    if(ca["Node"]){
        id = ca["Node"].substring(1, ca["Node"].length-1)
    }
    else {
        id = ca["Type"].substring(1, ca["Type"].length-1)
    }
    gca[id] = ca;
    return gca;
}

module.exports = {
    classAdToJson : classAdToJson
}
