var ref = require('ref');
var ffi = require('ffi');
var Struct = require('ref-struct');

//(:lazy, :global)
var slurm = ffi.Library('libslurm', {
   'slurm_api_version': [ 'long', []],
   'slurm_init_job_desc_msg' : [ 'void', ['pointer']], // (JobDescriptor ptr)
   'slurm_load_job' : [ 'int', ['pointer', 'int' ,'int']], // (job_info_msg_t**, jobid, show_flags)
   'slurm_load_jobs' : [ 'int', ['int', 'pointer', 'int',]], //(update_time, job_info_msg_t** job_info_msg_pptr, show_flags)
   'slurm_free_job_info_msg' : [ 'void', ['pointer']],//(job_info_msg_t*)
   'slurm_print_ctl_conf'
});

console.log(slurm.slurm_api_version())

  // values may be OR'd with JOB_STATE_FLAGS
  var JobState = [
    "JOB_PENDING",    //  queued waiting for initiation
    "JOB_RUNNING",    //  allocated resources and executing
    "JOB_SUSPENDED",    //  allocated resources, execution suspended
    "JOB_COMPLETE",   //  completed execution successfully
    "JOB_CANCELLED",    //  cancelled by user
    "JOB_FAILED",   //  completed execution unsuccessfully
    "JOB_TIMEOUT",    //  terminated on reaching time limit
    "JOB_NODE_FAIL",    //  terminated on node failure
    "JOB_PREEMPTED",    //  terminated due to preemption
    "JOB_END"     //  not a real state, last entry in table
  ];

  var JobShowFlag = {
    "SHOW_ALL":     0x1,
    "SHOW_DETAIL":  0x2,
    "SHOW_DETAIL2": 0x4
  };

  // Reasons for job to be pending
  var job_state_reason = [
    "WAIT_NO_REASON", //  not set or job not pending
    "WAIT_PRIORITY",    //  higher priority jobs exist
    "WAIT_DEPENDENCY",  //  dependent job has not completed
    "WAIT_RESOURCES",   //  required resources not available
    "WAIT_PART_NODE_LIMIT", //  request exceeds partition node limit
    "WAIT_PART_TIME_LIMIT", //  request exceeds partition time limit
    "WAIT_PART_DOWN",   //  requested partition is down
    "WAIT_PART_INACTIVE", //  requested partition is inactive
    "WAIT_HELD",    //  job is held by administrator
    "WAIT_TIME",    //  job waiting for specific begin time
    "WAIT_LICENSES",    //  job is waiting for licenses
    "WAIT_ASSOC_JOB_LIMIT", //  user/bank job limit reached
    "WAIT_ASSOC_RESOURCE_LIMIT",//  user/bank resource limit reached
    "WAIT_ASSOC_TIME_LIMIT",  //  user/bank time limit reached
    "WAIT_RESERVATION", //  reservation not available
    "WAIT_NODE_NOT_AVAIL",  //  required node is DOWN or DRAINED
    "WAIT_HELD_USER",   //  job is held by user
    "WAIT_TBD2",
    "FAIL_DOWN_PARTITION",  //  partition for job is DOWN
    "FAIL_DOWN_NODE",   //  some node in the allocation failed
    "FAIL_BAD_CONSTRAINTS", //  constraints can not be satisfied
    "FAIL_SYSTEM",    //  slurm system failure
    "FAIL_LAUNCH",    //  unable to launch job
    "FAIL_EXIT_CODE",   //  exit code was non-zero
    "FAIL_TIMEOUT",   //  reached end of time limit
    "FAIL_INACTIVE_LIMIT",  //  reached slurm InactiveLimit
    "FAIL_ACCOUNT",     //  invalid account
    "FAIL_QOS",         //  invalid QOS
    "WAIT_QOS_THRES",         //  required QOS threshold has been breached
    "WAIT_QOS_JOB_LIMIT", //  QOS job limit reached
    "WAIT_QOS_RESOURCE_LIMIT",//  QOS resource limit reached
    "WAIT_QOS_TIME_LIMIT" //  QOS time limit reached
  ];

var HIGHEST_DIMENSIONS = 5;
/*
// For submit, allocate, and update requests
// `job_desc_msg_t`
var JobDescriptor = Struct({
      "account": "string", //  charge to specified account
      "acctg_freq": "uint16", //  accounting polling interval (seconds)
      "alloc_node": "string", // node making resource allocation request NOTE: Normally set by slurm_submit* or slurm_allocate* function
      "alloc_resp_port": "uint16", //  port to send allocation confirmation to
      "alloc_sid": "uint32", // local sid making resource allocation request NOTE: Normally set by slurm_submit* or slurm_allocate* function NOTE: Also used for update flags, see ALLOC_SID_* flags
      "argc": "uint32", //  number of arguments to the script
      "argv": "pointer", //  arguments to the script
      "begin_time": "int64", //  delay initiation until this time
      "ckpt_interval": "uint16", //  periodically checkpoint this job
      "ckpt_dir": "string", //  directory to store checkpoint images
      "comment": "string", //  arbitrary comment (used by Moab scheduler)
      "contiguous": "uint16", //  1 if job requires contiguous nodes, 0 otherwise,default=0
      "cpu_bind": "string", //  binding map for map/mask_cpu
      "cpu_bind_type": "uint16", //  see cpu_bind_type_t
      "dependency": "string", //  synchronize job execution with other jobs
      "end_time": "int64", //  time by which job must complete, used for job update only now, possible deadline scheduling in the future
      "environment": "pointer", //  environment variables to set for job,  name=value pairs, one per line
      "env_size": "uint32", //  element count in environment
      "exc_nodes": "string", //  comma separated list of nodes excluded from job's allocation, default NONE
      "features": "string", //  comma separated list of required features, default NONE
      "gres": "string", //  comma separated list of required generic resources, default NONE
      "group_id": "uint32", //  group to assume, if run as root.
      "immediate": "uint16", //  1 if allocate to run or fail immediately, 0 if to be queued awaiting resources
      "job_id": "uint32", //  job ID, default set by SLURM
      "kill_on_node_fail": "uint16", //  1 if node failure to kill job, 0 otherwise,default=1
      "licenses": "string", //  licenses required by the job
      "mail_type": "uint16", //  see MAIL_JOB_ definitions above
      "mail_user": "string", //  user to receive notification
      "mem_bind": "string", //  binding map for map/mask_cpu
      "mem_bind_type": "uint16", //  see mem_bind_type_t
      "name": "string", //  name of the job, default ""
      "network": "string", //  network use spec
      "nice": "uint16", //  requested priority change, NICE_OFFSET == no change
      "num_tasks": "uint32", //  number of tasks to be started, for batch only
      "open_mode": "uint8", //  out/err open mode truncate or append, see OPEN_MODE_*
      "other_port": "uint16", //  port to send various notification msg to
      "overcommit": "uint8", //  over subscribe resources, for batch only
      "partition": "string", //  name of requested partition, default in SLURM config
      "plane_size": "uint16", //  plane size when task_dist = SLURM_DIST_PLANE
      "priority": "uint32", //  relative priority of the job, explicitly set only for user root, 0 == held (don't initiate)
      "qos": "string", //  Quality of Service
      "resp_host": "string", //  NOTE: Set by slurmctld
      "req_nodes": "string", //  comma separated list of required nodes default NONE
      "requeue": "uint16", //  enable or disable job requeue option
      "reservation": "string", //  name of reservation to use
      "script": "string", //  the actual job script, default NONE
      "shared": "uint16", //  1 if job can share nodes with other jobs, 0 if job needs exclusive access to the node, or NO_VAL to accept the system default. SHARED_FORCE to eliminate user control.
      "spank_job_env": "pointer", //  environment variables for job prolog/epilog scripts as set by SPANK plugins
      "spank_job_env_size": "uint32", //  element count in spank_env
      "task_dist": "uint16", //  see enum task_dist_state
      "time_limit": "uint32", //  maximum run time in minutes, default is partition limit
      "time_min": "uint32", //  minimum run time in minutes, default is time_limit
      "user_id": "uint32", //  set only if different from current UID, can only be explicitly set by user root
      "wait_all_nodes": "uint16", //  0 to start job immediately after allocation  to start job after all nodes booted or NO_VAL to use system default
      "warn_signal": "uint16", //  signal to send when approaching end time
      "warn_time": "uint16", //  time before end to send signal (seconds)
      "work_dir": "string", //  pathname of working directory
      "job constraints": "string",
      "cpus_per_task": "uint16", //  number of processors required for each task
      "min_cpus": "uint32", //  minimum number of processors required, default=0
      "max_cpus": "uint32", //  maximum number of processors required, default=0
      "min_nodes": "uint32", //  minimum number of nodes required by job, "efault=0
      "max_nodes": "uint32", //  maximum number of nodes usable by job, default=0
      "sockets_per_node": "uint16", //  sockets per node required by job
      "cores_per_socket": "uint16", //  cores per socket required by job
      "threads_per_core": "uint16", //  threads per core required by job
      "ntasks_per_node": "uint16", //  number of tasks to invoke on each node
      "ntasks_per_socket": "uint16", //  number of tasks to invoke on each socket
      "ntasks_per_core": "uint16", //  number of tasks to invoke on each core
      "pn_min_cpus": "uint16", //  minimum // CPUs per node, default=0
      "pn_min_memory": "uint32", //  minimum real memory per node OR real memory per CPU | MEM_PER_CPU, default=0 (no limit)
      "pn_min_tmp_disk": "uint32", //  minimum tmp disk per node, default=0

      // The following parameters are only meaningful on a Blue Gene
      // system at present. Some will be of value on other system. Don't remove these
      // they are needed for LCRM and others that can't talk to the opaque data type
      // select_jobinfo.
      "geometry": "[:uint16, HIGHEST_DIMENSIONS]", //  node count in various dimensions, e.g. X, Y, and Z
      "conn_type": "[:uint16, HIGHEST_DIMENSIONS]", //  see enum connection_type
      "reboot": "uint16", //  force node reboot before startup
      "rotate": "uint16", //  permit geometry rotation if set
      "blrtsimage": "string", //  BlrtsImage for block
      "linuximage": "string", //  LinuxImage for block
      "mloaderimage": "string", //  MloaderImage for block
      "ramdiskimage": "string", //  RamDiskImage for block
      // End of Blue Gene specific values
      "req_switch": "uint32", //  Minimum number of switches
      "select_jobinfo": "pointer", //  opaque data type, SLURM internal use only (dynamic_plugin_data_t)
      "std_err": "string", //  pathname of stderr
      "std_in": "string", //  pathname of stdin
      "std_out": "string", //  pathname of stdout
      "wait4switch": "uint32", //  Maximum time to wait for minimum switches
      "wckey": "string" //  wckey for job
});
var attroplPtr = ref.refType(attropl);

var JobInfo = Struct({
        "account": "string",  //  charge to specified account
        "alloc_node": "string",  //  local node making resource alloc
        "alloc_sid": "uint32",  //  local sid making resource alloc
        "assoc_id": "uint32",  //  association id for job
        "batch_flag": "uint16",  //  1 if batch" queued job with script
        "batch_host": "string",  //  name of host running batch script
        "batch_script": "string",  //  contents of batch script
        "command": "string",  //  command to be executed
        "comment": "string",  //  arbitrary comment (used by Moab scheduler)
        "contiguous": "uint16",  //  1 if job requires contiguous nodes
        "cpus_per_task": "uint16",  //  number of processors required for each task
        "dependency": "string",  //  synchronize job execution with other jobs
        "derived_ec": "uint32",  //  highest exit code of all job steps
        "eligible_time": "int64",  //  time job is eligible for running
        "end_time": "int64",  //  time of termination, actual or expected
        "exc_nodes": "string",  //  comma separated list of excluded nodes
        "exc_node_inx": "pointer", // int* : excluded list index pairs into node_table start_range_1, end_range_1, start_range_2, .., -1
        "exit_code": "uint32",  //  exit code for job (status from wait call)
        "features": "string",  //  comma separated list of required features
        "gres": "string",  //  comma separated list of generic resources
        "group_id": "uint32",  //  group job sumitted as
        "job_id": "uint32",  //  job ID
        "job_state": "JobState",  //  state of the job, see enum job_states
        "licenses": "string",  //  licenses required by the job
        "max_cpus": "uint32",  //  maximum number of cpus usable by job
        "max_nodes": "uint32",  //  maximum number of nodes usable by job
        "sockets_per_node": "uint16",  //  sockets per node required by job
        "cores_per_socket": "uint16",  //  cores per socket required by job
        "threads_per_core": "uint16",  //  threads per core required by job
        "name": "string",  //  name of the job
        "network": "string",  //  network specification
        "nodes": "string",  //  list of nodes allocated to job
        "node_inx": "pointer", // int*  list index pairs into node_table for *nodes* start_range_1, end_range_1, start_range_2, .., -1
        "nice": "uint16",  //  requested priority change
        "ntasks_per_core": "uint16",  //  number of tasks to invoke on each core
        "ntasks_per_node": "uint16",  //  number of tasks to invoke on each node
        "ntasks_per_socket": "uint16",  //  number of tasks to invoke on each socket

        "num_nodes": "uint32",  //  minimum number of nodes required by job
        "num_cpus": "uint32",  //  minimum number of cpus required by job
        "partition": "string",  //  name of assigned partition
        "pn_min_memory": "uint32",  //  minimum real memory per node, default=0
        "pn_min_cpus": "uint16",  //  minimum // CPUs per node, default=0
        "pn_min_tmp_disk": "uint32",  //  minimum tmp disk per node, default=0
        "pre_sus_time": "int64",  //  time job ran prior to last suspend
        "priority": "uint32",  //  relative priority of the job, 0=held, 1=required nodes DOWN/DRAINED
        "qos": "string",  //  Quality of Service
        "req_nodes": "string",  //  comma separated list of required nodes
        "req_node_inx": "pointer", // int*  required list index pairs into node_table start_range_1, end_range_1, start_range_2, .., -1
        "req_switch": "uint32",  //  Minimum number of switches
        "requeue": "uint16",  //  enable or disable job requeue option
        "resize_time": "int64",  //  time of latest size change
        "restart_cnt": "uint16",  //  count of job restarts
        "resv_name": "string",  //  reservation name
        "select_jobinfo": "pointer", // dynamic_plugin_data_t *select_jobinfo;  opaque data type, process using slurm_get_select_jobinfo()
        "job_resrcs": "pointer", // job_resources_t *job_resrcs;  opaque data type, job resources
        "shared": "uint16",  //  1 if job can share nodes with other jobs
        "show_flags": "uint16",  //  conveys level of details requested
        "start_time": "int64",  //  time execution begins, actual or expected
        "state_desc": "string",  //  optional details for state_reason
        "state_reason": "uint16",  //  reason job still pending or failed, see slurm.h"enum job_state_reason
        "submit_time": "int64",  //  time of job submission
        "suspend_time": "int64",  //  time job last suspended or resumed
        "time_limit": "uint32",  //  maximum run time in minutes or INFINITE
        "time_min": "uint32",  //  minimum run time in minutes or INFINITE
        "user_id": "int32",  //  user the job runs as
        "preempt_time": "int64",  //  preemption signal time
        "wait4switch": "uint32",  //  Maximum time to wait for minimum switches
        "wckey": "string",  //  wckey for job
        "work_dir": "string"  //  pathname of working directory
});

var JobInfoMsg = Struct({
   "last_update": "int64",   // last_update;  time of latest info
   "record_count": "uint32", // record_count;   number of records
   "job_array": "pointer"    // job_info_t *job_array;   the job records
});
*/
module.exports = {
   api_version : slurm.slurm_api_version.async,
};
