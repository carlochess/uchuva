var ref = require('ref');
var ffi = require('ffi');
var Struct = require('ref-struct');

var attropl = Struct({
  'name': 'string',
  'resource' : 'string',
  'value': 'string',
  'batch_op' : 'int',
});
attropl.defineProperty('next', ref.refType(attropl));
var attroplPtr = ref.refType(attropl);


var torque = ffi.Library('libtorque', {
   'pbs_query_max_connections': [ 'int', []],
   'pbs_connect' : [ 'int', ['string']],
   'pbs_submit' : [ 'string', ['int', attroplPtr ,'string','string','string']], 
   'pbs_disconnect' : [ 'int', ['int']],
});

function convertir(atributos){
    var attr = null;
    for (var prop in atributos) {
        if(attr){
            var attr2 = new attropl({
             "name" : prop,
             "value" : atributos[prop],
             "resource" : null,
             "batch_op" : null,
             "next" : attr.ref()
            });
        }else{
            var attr2 = new attropl({
             "name" : prop,
             "resource" : null,
             "batch_op" : null,
             "value" : atributos[prop],
            });
        }
        attr = attr2;
    }
    return attr;
}

module.exports = {
   query_max_connections : torque.pbs_query_max_connections.async,
   connect : torque.pbs_connect.async,
   submit : torque.pbs_submit.async,
   disconnect : torque.pbs_disconnect.async
};
