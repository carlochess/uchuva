#!/bin/bash
/usr/bin/gnuplot <<__EOF
set view map
set pm3d
set dgrid3d
# Set Palette Heatmap
set palette rgb 7,5,15
set title "Relaxation Method"
set term png
set output "Rlxm.png"
splot "RlxMthd_v1.0_2000.dat" using 1:2:3 with pm3d
pause -1
__EOF
