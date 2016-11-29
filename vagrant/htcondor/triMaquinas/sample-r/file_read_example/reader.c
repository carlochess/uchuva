#include<stdio.h>

int main()
{
	FILE *ptr_file;
	char buf[1000];

	ptr_file =fopen("test.txt","r");
	if (!ptr_file)
		return 1;

	while (fgets(buf,1000, ptr_file)!=NULL)
		printf("%s",buf);

	fclose(ptr_file);
	return 0;
}
