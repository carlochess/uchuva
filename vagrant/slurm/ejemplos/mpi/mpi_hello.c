#include <stdio.h>
#include <unistd.h>
#include <mpi.h>

int main(int argc, char** argv) {
    int myrank, nprocs;
    char hostname[256];

    MPI_Init(&argc, &argv);
    MPI_Comm_size(MPI_COMM_WORLD, &nprocs);
    MPI_Comm_rank(MPI_COMM_WORLD, &myrank);
    gethostname(hostname,255);

    printf("Hello from processor %d of %d on host %s\n", myrank, nprocs,hostname);

    MPI_Finalize();
    return 0;
}
