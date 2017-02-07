var ffi = require('ffi');
var RTLD_NOW = ffi.DynamicLibrary.FLAGS.RTLD_NOW;
var RTLD_GLOBAL = ffi.DynamicLibrary.FLAGS.RTLD_GLOBAL;
var mode = RTLD_NOW | RTLD_GLOBAL | RTLD_NOW;

var libm2 = ffi.Library('liblsbatch.so', mode, {
});
var libm = ffi.Library('liblsf', mode, {
});

//console.log(libm.ls_getclustername()); // 2
