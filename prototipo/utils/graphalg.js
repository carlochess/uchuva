function KahnSAlgorithm(graph){
	var copiaNodes = graph.nodes.slice();
	var copiaEdges = graph.edges.slice();

	// Si el nodo tiene incisivos
	var esAmado = function(nodo){
		for(var i=0; i< copiaEdges.length ; i++){
			if(copiaEdges[i].target.id == nodo.id){
			 	return true;
			}
		}
		return false;
	};
	// lista de nodos apuntados por N
	var amadosPor = function(nodo){
		var res = [];
		for(var i=0; i< copiaEdges.length ; i++){
			if(copiaEdges[i].source.id == nodo.id){
			  res.push(graph.nodes[indiceDe(copiaEdges[i].target, graph.nodes)]);
			}
		}
		return res;
	};

	var indiceDe = function(nodo, l){
		for(var i=0; i< l.length ; i++){
			if(l[i].id == nodo.id){
			 	return i;
			}
		}
		return -1;
	};

	var indiceD2e = function(nodo, l){
		for(var i=0; i< l.length ; i++){
			if(l[i].source.id == nodo.source.id && l[i].target.id == nodo.target.id){
			 	return i;
			}
		}
		return -1;
	};

	var L = [];
	var S = (function() {
		for(var i=0; i< copiaEdges.length ; i++){
			var nodo = copiaEdges[i].target;
			var indiceNodo = indiceDe(nodo, copiaNodes);
			if(indiceNodo!= -1)
				copiaNodes.splice(indiceNodo,1);
		}
		return copiaNodes;
	})();
	while(S.length > 0){
		var n = S.pop();
		L.push(n);
		var amadosPorN = amadosPor(n);
		amadosPorN.forEach(function(m){
			var indiceEdge = indiceD2e({source: n, target: m}, copiaEdges);
			copiaEdges.splice(indiceEdge,1);
			if(!esAmado(m)){
				S.push(m);
			}
		});
	}
	return {ciclos: copiaEdges.length!== 0, orden : L};
}

exports.KahnSAlgorithm = KahnSAlgorithm;
