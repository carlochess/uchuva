#!/bin/bash
#
#SBATCH --job-name=test_mpi
#SBATCH --output=out_mpi.txt
#
#SBATCH --ntasks=2
#SBATCH --time=2:00

# mpicc integracion.c -o integracion.mpi -lm
# sbatch bintegracion.sh
srun --mpi=pmi2 integracion.mpi

