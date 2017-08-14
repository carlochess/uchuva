#PBS -N JobName
#PBS -l nodes=1:ppn=1,mem=2000m,walltime=24:00:00
#PBS -S /bin/bash
#PBS -e JobName.err
#PBS -o JobName.out
cd $PBS_O_WORKDIR
echo Hello World! > holamundo.txt
