package main
/*
#cgo pkg-config: slurm

#include <stdio.h>
#include <stdlib.h>
#include <signal.h>

#include "slurm/slurm.h"
#include "slurm/slurm_errno.h"

typedef char* chars;

#define SLUW_LIST(T,S) \
T *sluw_alloc_##T (int s) { T *r = (T *)calloc(s+1, sizeof(T)); if (r) r[s]=S; return r;} \
void sluw_set_##T (T *l, T v, int p) { l[p]=v; } \
size_t sluw_len_##T (T *l) { size_t i=0; if (l) while (l[i]!=S) i++; return i;}

SLUW_LIST(uint32_t,0)
SLUW_LIST(int32_t,-1)
SLUW_LIST(chars,NULL)
*/
import (
	"C"
)

import (
	"log"
)

func main() {
  ret := C.slurm_api_version();
  //errno_str := "SLURM-" + strconv.Itoa(int(errno)) + " " + C.GoString(C.slurm_strerror(errno))
	log.Println(ret)
}
