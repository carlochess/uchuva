// gcc -o main -lslurm -I/usr/include -L/usr/lib main.c
// -I${includedir} -L${libdir} -lslurm
#include <stdio.h>
#include <stdlib.h>
#include "slurm/slurm.h"
#include "slurm/slurm_errno.h"

int main (int argc, char *argv[])
{
    slurm_ctl_conf_t * conf_info_msg_ptr = NULL;
    long version = slurm_api_version();

    printf("slurm_api_version: %ld, %ld.%ld.%ld\n", version,
         SLURM_VERSION_MAJOR(version),
         SLURM_VERSION_MINOR(version),
         SLURM_VERSION_MICRO(version));

    // get and print some configuration information
    if ( slurm_load_ctl_conf ((time_t) NULL,
                              &conf_info_msg_ptr ) ) {
         slurm_perror ("slurm_load_ctl_conf error");
         exit (1);
    }
    // The easy way to print
    slurm_print_ctl_conf (stdout,
                          conf_info_msg_ptr);

    printf ("control_machine = %s\n",
            conf_info_msg_ptr->control_machine);
    printf ("first_job_id = %u\n",
            conf_info_msg_ptr->first_job_id);
    slurm_free_ctl_conf (conf_info_msg_ptr);

    exit (0);
}
