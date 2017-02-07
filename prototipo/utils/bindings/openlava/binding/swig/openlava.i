%module example
%{
 /* Includes the header in the wrapper code */
 #include "lsf.h"
%}

 /* Parse the header file to generate wrappers */
%include "lsf.h"
