#!/usr/bin/env python

import drmaa
import os

def main():
    """Submit an array job, wait for them to finish, and collect results.
    This is slightly different from the example from sunsource because it only
    waits for the jobs that it submitted.
    """
    s = drmaa.Session()
    s.initialize()
    print 'Creating job template'
    jt = s.createJobTemplate()
    jt.remoteCommand = os.getcwd() + '/sleeper.sh'
    jt.args = ['42','Simon says:']
    #jt.joinFiles=True
    
    joblist = s.runJob(jt)
    print 'Your job has been submitted with id ' + str(joblist)

    print 'Cleaning up'

    s.deleteJobTemplate(jt)
    s.exit()
    
if __name__=='__main__':
    main()
