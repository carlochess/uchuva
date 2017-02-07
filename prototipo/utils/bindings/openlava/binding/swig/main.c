extern "C" {
  #include "lsf.h"
  #include "lsbatch.h"
}

int main()
{
    char *cluster;
    char *master;

    //printf("I am %s number %d\n", __func__, n);

    cluster = ls_getclustername();
    if (cluster == NULL) {
        ls_perror("ls_getclustername");
        return -1;
    }
    printf("My cluster name is %s\n", cluster);

    master = ls_getmastername();
    if (master == NULL) {
        ls_perror("ls_getmastername");
        return -1;
    }
    printf("My master name is %s\n", master);

    return 0;
}

// g++ -o main -I/opt/openlava-4.0/lsf -I/opt/openlava-4.0/lsbatch -lsf -lsbatch -lnsl main.c

// export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/opt/openlava-4.0/lib
