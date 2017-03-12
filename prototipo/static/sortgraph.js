var g = new dagre.graphlib.Graph();
g.setGraph({});
g.setDefaultEdgeLabel(function() { return {}; });

nodes.forEach(function(node){
  g.setNode(node.id, { label: node.id,  width: 150, height: 80 });
});

edges.forEach(function(edge){
  g.setEdge(edge.source.id, edge.target.id);
});

dagre.layout(g);

function search(nodes, id){
  for(var i=0; i<nodes.length; i++){
    if(nodes[i].id===id)
      return i;
  }
  return -1;
}

g.nodes().forEach(function(v) {
  var node = g.node(v);
  var realNode = search(nodes, node.label);
  nodes[realNode].x = node.x+300;
  nodes[realNode].y = node.y+100;
});
