/*
	Relaxacion method for temperature interpolation

		Vivas,A;Arango,C;Arguelles,A; 
		Lascilab
		CIBioFi-QuanTIC
		  
		Last updated: January 24, 2017

	This program is in development. 

	Laboratory of Distributed systems and Networks
	http://Lascilab.univalle.edu.co/

*/
#include <stdlib.h>	/* Standard Libary: malloc, calloc, free, ralloc functions */
#include <stdio.h> 	/* Standard I/O Library: printf */
#include <math.h>	/* Standard Math Library */

struct Station
{
	int x;		/* x coordinate */
	int y;		/* y coordinate */
	double t;	/* temperature */
};


void mapload(int* B,int Nx,int Ny){
   	FILE *file = fopen("boolmatrix.dat", "r");
    	int x = 0, y = 0, b = 0;
    	for(; fscanf(file, "%d\t%d\t%d", &y, &x, &b) && !feof(file);) B[ y * Nx + x ] = b;
 	fclose(file);	
}

void estload(int* B,double* matrix,int Nx,int Ny,struct Station* s){
   	FILE *file = fopen("Maps/estaciones.dat", "r");
    	int x = 0, y = 0, i = 0;
	double tmp = 0.0;
    	for(; fscanf(file, "%d\t%d\t%lf",&x,&y,&tmp) && !feof(file);) {
	B[ y * Nx + x ] = 2;
	s[i].x = x;
	s[i].y = y;
	s[i].t =  tmp;
	i++;
	}
	
 	fclose(file);		
}

void Tempload(int * B,double * matrix, int nx, int ny,struct Station* s, int ne){
	double sum = 0;
	int i;
	for (i = 0; i < ne; i++) sum = sum + s[i].t;
	double Tprom =  ( sum / ne );
	for (i=0; i < nx * ny; i++) matrix[i] = ( B[i] == 0 )? 0 : Tprom;
	for (i=0; i < ne ; i++) matrix[( s[i].y * nx + s[i].x ) ] = s[i].t;
}

void prntB(int * matrix, int nx, int ny){
	int i;
	for (i = 1; i <= nx * ny; i++)
	{
		int b_i = (i-1)/nx, b_j = (i-1)%nx; 
		printf("%d\t",matrix[i-1]);
		if(i % nx == 0) printf("\n");
	}
}

void prntT(double * matrix, int nx, int ny){
	int i;
	for (i = 1; i <= nx * ny; i++)
	{
		printf("%f\t", matrix[i-1]);
		if(i % nx == 0) printf("\n");
	}
}

double transition(int * B, double * T, int nx, int ny, int cell){
	int row = 0, col = 0;
	row = cell / nx, col = cell % nx;

	double up = ( row - 1 < 0 || B[ cell - nx ] == 0 ) ? 0 : T[cell - nx];
	double down = ( row + 1 >= ny || B[ cell + nx ] == 0 ) ? 0 : T[cell + nx];
	double left = ( col - 1 < 0 || B[ cell - 1 ] == 0 ) ? 0 : T[ cell - 1 ];
	double right = ( col + 1 >= nx || B[ cell + 1 ] == 0) ? 0 : T[ cell + 1];
	double sum = ((up > 0) ? 1:0) + ((down > 0) ? 1:0) + ((left > 0) ? 1:0) + ((right > 0) ? 1:0);
	double Tij = (up + down + left + right) / sum;
	//printf("Row %d, Col %d, up %f,down %f, left %f, right %f, sum %f, Tij %f\n",row,col,up,down,left,right,sum,Tij);
	return (B[cell] == 0 || B[cell] == 2) ? T[cell] : Tij;
}

int test(int * B, double * Ta, double * Tb, int nx, int ny){
	int i = 0;
	double result = 0;
	for (i = 0; i < nx * ny; ++i) result += (B[i] == 0 || B[i] == 2) ? 0 : pow(Tb[i] - Ta[i],2);
	printf("Test Result delta: %.10f\n",result);
	//result = (1 / (nx*ny)) * sqrt(result);
	result =  sqrt(result);
	//printf("Test Result: %.10f\n",result);
	return ( result <= 0.0000001 ) ? 1 : 0;
}

void evolve(int * B, double * Tin, double * Tout, int nx, int ny){
	int i = 0;
	for (i = 0; i < nx * ny; ++i) Tout[i] = transition(B,Tin,nx,ny,i);
}

void printMatrixes(int * B, double * Ta, double * Tb, int nx, int ny){
	printf("B\n");
	prntB(B,nx,ny);
	printf("Ta\n");
	prntT(Ta,nx,ny);
	printf("Tb\n");
	prntT(Tb,nx,ny);
}

int main(int argc, char const **argv)
{
	FILE *dskw1;
	char FileName[50];
	int file;	
	
	int Nx = 500;
    	int Ny = 1397;
	int Ne = 16;
	
	struct Station s[Ne];

	int * B = NULL;
	double * Ta = NULL;
	double * Tb = NULL;

	B = (int *) malloc( Nx * Ny * sizeof(int));
	Ta = (double *) malloc(Nx * Ny * sizeof(double));
	Tb = (double *) malloc(Nx * Ny * sizeof(double));
	
	mapload(B,Nx,Ny);
	estload(B,Ta,Nx,Ny,s);
	Tempload(B,Ta,Nx,Ny,s,Ne);
	
	for (int i = 0 ; i < 2000; i++) {

	evolve(B,Ta,Tb,Nx,Ny);
	
	double * temp = Ta;
	Ta = Tb;
	Tb = temp;

	}

  	dskw1=fopen("./OutputData/RlxMthd_v1.0_2000.dat","w+");
	if (dskw1 == NULL)
    {
        printf("Error opening file!\n");
        exit(1);
    }
	for (int c = 0; c < Nx * Ny; c++)
	{		
	int x=( c % Nx ) + 1;
	int y=( c / Nx ) + 1;
	fprintf(dskw1,"%d\t%d\t%f\n",x,y,Tb[c]);
	}
	
	fclose(dskw1);
	/*int i = 0;
	for (i = 0; i < 20000; ++i)
	{
		printf("Generation %d\n",i+1);
		evolve(B,Ta,Tb,Nx,Ny);
		double * temp = Ta;
		Ta = Tb;
		Tb = temp;
		printf("Test: %d\n",test(B,Ta,Tb,Nx,Ny));
	}*/

	//printMatrixes(B,Ta,Tb,Nx,Ny);

	/*
	printf("Transition: %f\n",transition(B,Ta,Nx,Ny,32));

	printf("Evolve\n");
	
	printf("Generation 0\n");
	printf("Test: %d\n",test(B,Ta,Tb,Nx,Ny));
	printMatrixes(B,Ta,Tb,Nx,Ny);
	
	printf("Generation 1\n");
	evolve(B,Ta,Tb,Nx,Ny);
	double * temp = Ta;
	Ta = Tb;
	Tb = temp;
	printf("Test: %d\n",test(B,Ta,Tb,Nx,Ny));
	printMatrixes(B,Ta,Tb,Nx,Ny);

	printf("Generation 2\n");
	evolve(B,Ta,Tb,Nx,Ny);
	temp = Ta;
	Ta = Tb;
	Tb = temp;
	printf("Test: %d\n",test(B,Ta,Tb,Nx,Ny));
	printMatrixes(B,Ta,Tb,Nx,Ny);
	*/

	free(B);
	free(Ta);
	free(Tb);

	return 0;
}
