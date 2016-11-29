/* C Example */
#include <mpi.h>
#include <math.h>
#include <stdio.h>
float fct(float x)
{
      return cos(x);
}
/* Prototype */
float integral(float a, int n, float h);
void main(argc,argv)
int argc;
char *argv[];
{
/***********************************************************************
 *                                                                     *
 * This is one of the MPI versions on the integration example          *
 * It demonstrates the use of :                                        *
 *                                                                     *
 * 1) MPI_Init                                                         *
 * 2) MPI_Comm_rank                                                    *
 * 3) MPI_Comm_size                                                    *
 * 4) MPI_Reduce                                                         *                                                         *
 * 5) MPI_Finalize                                                     *
 *                                                                     *
 ***********************************************************************/
      int n, p, i, j, ierr,num;
      float h, result, a, b, pi;
      float my_a, my_range;

      int myid, source, dest, tag;
      MPI_Status status;
      float my_result;

      pi = acos(-1.0);  /* = 3.14159... */
      a = 0.;           /* lower limit of integration */
      b = pi*1./2.;     /* upper limit of integration */
      n = 100000;          /* number of increment within each process */

      dest = 0;         /* define the process that computes the final result */
      tag = 123;        /* set the tag to identify this particular job */

/* Starts MPI processes ... */

      MPI_Init(&argc,&argv);              /* starts MPI */
      MPI_Comm_rank(MPI_COMM_WORLD, &myid);  /* get current process id */
      MPI_Comm_size(MPI_COMM_WORLD, &p);     /* get number of processes */

      h = (b-a)/n;    /* length of increment */
      num = n/p;	/* number of intervals calculated by each process*/
      my_range = (b-a)/p;
      my_a = a + myid*my_range;
      my_result = integral(my_a,num,h);

      printf("Process %d has the partial result of %f\n", myid,my_result);

/* Use an MPI sum reduction to collect the results */		      
      MPI_Reduce(&my_result, &result,1,MPI_REAL,MPI_SUM,0,MPI_COMM_WORLD);

      MPI_Finalize();                       /* let MPI finish up ... */
}
float integral(float a, int n, float h)
{
      int j;
      float h2, aij, integ;

      integ = 0.0;                 /* initialize integral */
      h2 = h/2.;
      for (j=0;j<n;j++) {             /* sum over all "j" integrals */
        aij = a + j*h;        /* lower limit of "j" integral */
        integ += fct(aij+h2)*h;
      }
      return (integ);
}
