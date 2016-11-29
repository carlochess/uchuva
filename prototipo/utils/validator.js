function isNode(){
  return false;
}
function isEdge(){
  return false;
}

module.exports = {
 customValidators: {
    isArrayOfNodes: function(value) {
        console.log(Array.isArray(value))
        console.log(value.filter(isNode).length === 0)
        return Array.isArray(value) && value.filter(isNode).length === 0;
    },
    isArrayOfEdges: function(value) {
        return Array.isArray(value) && value.filter(isEdge).length === 0;
    }
 }
};
