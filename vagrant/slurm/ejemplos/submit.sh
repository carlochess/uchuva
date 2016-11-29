#!/bin/bash
# sbatch submit.sh
#SBATCH --job-name=test
#SBATCH --output=res.txt
#
#SBATCH --ntasks=1
#SBATCH --time=10:00

srun hostname
srun sleep 60
