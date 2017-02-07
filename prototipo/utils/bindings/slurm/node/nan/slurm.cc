#include <nan.h>
extern "C" {
  #include <stdio.h>
  #include <stdlib.h>
  #include "slurm/slurm.h"
  #include "slurm/slurm_errno.h"
}

using namespace v8;

/*
  error
fprintf (stderr, "Slurm function errno = %d\n",
slurm_get_errno ());
fprintf (stderr, "Slurm function errno = %d %s\n",
slurm_get_errno (),
slurm_strerror (slurm_get_errno ()));
slurm_perror ("Slurm function");
*/


NAN_METHOD(submit_job){
    job_desc_msg_t job_desc_msg; // L1531
    resource_allocation_response_msg_t* slurm_alloc_msg_ptr; // 
    submit_response_msg_t* slurm_alloc_msg; // 

    slurm_init_job_desc_msg( &job_desc_msg );
    job_desc_msg.script = "#!/bin/sh\nhostname\n";
    if (slurm_allocate_resources(&job_desc_msg,
                                 &slurm_alloc_msg_ptr)) {
      info.GetReturnValue().Set(Nan::New(-1));
      return;
    }

    if (slurm_submit_batch_job(&job_desc_msg,&slurm_alloc_msg)) {
      info.GetReturnValue().Set(Nan::New(-1));
      return;
    }
    
    int identif = slurm_alloc_msg->job_id;
    
    //slurm_free_resource_allocation_response_msg(slurm_alloc_msg_ptr);
    slurm_free_submit_response_response_msg(slurm_alloc_msg);
    
    info.GetReturnValue().Set(Nan::New(identif));
}

NAN_METHOD(api_version){
    int version = slurm_api_version();
    /*
    printf("slurm_api_version: %ld, %ld.%ld.%ld\n", version,
         SLURM_VERSION_MAJOR(version),
         SLURM_VERSION_MINOR(version),
         SLURM_VERSION_MICRO(version));
    */
    info.GetReturnValue().Set(Nan::New(version));
}

NAN_MODULE_INIT(init){
    Nan::Set(target,
      Nan::New<v8::String>("api_version").ToLocalChecked(),
      Nan::GetFunction(Nan::New<FunctionTemplate>(api_version)).ToLocalChecked()
    );
    Nan::Set(target,
      Nan::New<v8::String>("submit_job").ToLocalChecked(),
      Nan::GetFunction(Nan::New<FunctionTemplate>(submit_job)).ToLocalChecked()
    );
}

NODE_MODULE(slurm, init)
