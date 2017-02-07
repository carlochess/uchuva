// npm init -y
// npm i node-gyp -g && npm i node-bindings nan --save
// en el package.json agregamos: "gypfile": true
/* Y creamos binding.gyp
{
 "targets": [ 
   { 
     "target_name": "openlava",
     "sources": [ "openlava.cc" ],
     "include_dirs": [ "<!(node -e \"require('nan')\")" ]
   } 
 ]
}
Crear un archivo en 
sudo nano  /etc/ld.so.conf.d/openlava.conf
sudo ldconfig
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$LSF_LIBDIR/
export LIBRARY_PATH=$LIBRARY_PATH:$LSF_LIBDIR
*/
#include <nan.h>
extern "C" {
  #include "lsf.h"
  #include "lsbatch.h"
}

using namespace v8;

NAN_METHOD(getclustername){
    char *cluster;
    cluster = ls_getclustername();
    if (cluster == NULL) {
        //ls_perror("ls_getclustername");
        //return -1;
        cluster = (char *)"nada";
    }
    info.GetReturnValue().Set(Nan::New(cluster).ToLocalChecked());
}

NAN_METHOD(getmastername){
    char *master;
    master = ls_getmastername();
    if (master == NULL) {
        //ls_perror("ls_getmastername");
        //return -1;
        master = (char *)"nada";
    }
    info.GetReturnValue().Set(Nan::New<v8::String>(master).ToLocalChecked());
}

NAN_MODULE_INIT(init){
    Nan::Set(target,
      Nan::New<v8::String>("getclustername").ToLocalChecked(),
      Nan::GetFunction(Nan::New<FunctionTemplate>(getclustername)).ToLocalChecked()
    );
    Nan::Set(target,
      Nan::New("getmastername").ToLocalChecked(),
      Nan::GetFunction(Nan::New<FunctionTemplate>(getmastername)).ToLocalChecked()
    );
}

NODE_MODULE(openlava, init)
