var validator = require('validator');
// dataUri
function isNode(node){
  return !validator.isAscii(node.title)
    && !validator.isAscii(node.title)
    && !validator.isNumeric(node.id)
    && !validator.isNumeric(node.x)
    && !validator.isNumeric(node.y);
}
function isEdge(edge){
  return false;
}

function isMongoId(str){
  return !validator.isMongoId(str);
}

module.exports = {
 customValidators: {
    isArrayOfNodes: function(value) {
        return Array.isArray(value) && value.filter(isNode).length === 0;
    },
    isArrayOfEdges: function(value) {
        return Array.isArray(value) && value.filter(isEdge).length === 0;
    },
    isArrayOfMongoId: function(value) {
        return Array.isArray(value) && value.filter(isMongoId).length === 0;
    }
 }
};
