CC = g++

bbjobs: main.c
	$(CC) -I${LSF_LIBDIR}/../include -L${LSF_LIBDIR} main.c -o main -llsf  -lnsl -lm

swig:
	swig3.0 -javascript -node -c++ -I${LSF_LIBDIR}/../include openlava.i

clean:
	rm -f *.o bbjobs
