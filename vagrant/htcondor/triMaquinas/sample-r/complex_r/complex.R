#!/usr/bin/env Rscript
doComplex <- function(x){
	len <- x 
	fibvals <- numeric(len)
	fibvals[1] <- 1
	fibvals[2] <- 1
	Sys.sleep(100)
	for (i in 3:len) { 
	   fibvals[i] <- fibvals[i-1]+fibvals[i-2]
	}
	print(fibvals) 
}

## Read Command Line Arguments
args <- commandArgs(trailingOnly = TRUE)
for (i in 1:length(args)) {
	## For each Argument, calculate the fib sequence
	print("NEW FIB SEQUENCE")
	doComplex(as.numeric (args[i]))
	print("================")
}

