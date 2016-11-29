#!/bin/bash
#
#SBATCH --job-name=test_mpi
#SBATCH --output=res_mpi.txt
#
#SBATCH --ntasks=2
#SBATCH --time=2:00

# mpicc mpi_hello.c -o hello.mpi
# sbatch bmpi.sh
# mpirun /vagrant/mpi/hello.mpi
# srun --mpi=pmi2 hello.mpi
mpirun ./hello.mpi

