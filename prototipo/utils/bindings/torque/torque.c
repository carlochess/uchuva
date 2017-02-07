#include <pbs_error.h>
#include <pbs_ifl.h>

// This function must be called before any of the other pbs_functions.
// They will transmit their batch requests over the connection established
// by this function.
// server -> host_name[:port] // ifnotdfn => {PBS_DIR}/default_destn . 
int pbs_connect(char server)

// pbs_disconnect\fP()



-------------------------------
// DESCRIPTION: Issue a batch request to submit a new batch job.
// batch request is generated and sent to the server over the connection specified by connect 
// which is the return value of pbs_connect()
// The job will be submitted to the queue specified by destination

/////////////////////////

// The parameter attrib is a list of attropl in pbs_ifl.h
struct attropl
{
  struct attropl *next;
  char   *name; // points to a string which is the name of the attribute
  char   *resource; // 
  char   *value; // points to a string which is the value of the attribute: The attribute names are defined in pbs_ifl.h
  enum batch_op   op;
};
    Names
"Execution_Time"
Defines the job's execution time.
"Account_Name"
Defines the account string.
"Error_Path"
Defines the path name for the standard error of the job.
"Join_Paths"
Defines whether standard error and standard output are joined (merged).
"Keep_Files"
Defines which output of the job is kept on the execution host.
"Resource_List"
Defines a resource required by the job.
"Job_Name"
Defines the job name.
"Output_Path"
Defines the path name for the standard output of the job.
"Shell_Path_List"
Defines the path to the shell which will interpret the job script.
"job_array_request"
Requests specific array IDs. Makes this submission a job array submit.
"Variable_List"
Defines the list of additional environment variables which are exported
to the job.
"depend"
Defines the inter\-job dependencies.
"stagein"
Defines the list of files to be staged in prior to job execution.
"stageout"
Defines the list of files to be staged out after job execution.

/////////////////////////

The parameter script is the path name to the job script. If the path name is relative, it will
be expanded to the processes current working directory. If script is a null pointer or the path name pointed to
is specified as the null string, no script is passed with the job.

/////////////////////////

The destination parameter specifies the destination for the job.  It is specified as:
[queue] If destination is the null string or the queue is not specified, the destination will be
the default queue at the connected server.

/////////////////////////

The parameter extend is reserved for implementation defined extensions.

char *pbs_submit(int connect, struct attropl *attrib, char *script, char *destination, char *extend);


The return value is a character string which is the job_identifier assigned to the job by the server.
The space for the job_identifier string is allocated by pbs_submit() and should be released via a call to free()
by the user when no longer needed.

