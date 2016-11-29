#!/bin/bash

condor_submit_dag -no_submit dagman.dag
# Esto generará el archivo necesario para condor_submit
# -> dagman.dag.condor.sub
# Sin embargo esto no es un class ad
condor_submit -dump dagman.dag.condor.sub.ad dagman.dag.condor.sub
mkdir -p debug
mv dagman.dag.condor.sub debug
mv dagman.dag.condor.sub.ad debug
