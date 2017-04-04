Admin
 - Add a workloader administration (and checking)
 - Check if an user is admin
 - Allow an admin to set another user role to admin
 - Add validations to endpoints
 - Add Promise's catches for each bd query
 - Add plugin framework upload
 - Improve plugin editor
 - Add a "table graph visualization" or a "tree visualization" (aka JTree)
 
App architecture
 - Separate Bussiness logic from Interface
 
Workloader integration
 - Separate in plugins the Workloader interactions
 - Create an interface for the above requirement
 - Owner of the dag
 - State of the Workloader
 - State of the workflow
 - Stop workflow
 - Remove a workflow, all his files and stop the execution
 - Colaborative Dags (the problem here is actually a problem of file sharing)

VFS
 - Add files using CLI (Big files)
 - Add a text editor
 - Copy files
 - Decompress in situ

VFS Store Pluggins: 
 - Add  for the storage: S3, HDFS, FTP, MongoGridFS
 - Add file retrival for that platforms
 
Windows support
 - Check for HTCondor configuration

Testing
 - Improve Selenium test
 - Create more Unit tests
 - Create JMeter test
 
CI/CD
 - Use at least two git branches

GUI
 - Improve the "command framework" gui
 - Improve the lateral menu
 - Fix /build log/out/err node information
 - Add a CMS for each project

Command Framework
 - Add and review more commands plugins

API Rest
 - Correct the error handling for the rest api
 - Change the project name
 - Add a Heartbeat end point

Logging
 - Better logging information
 - Add file rotation winston-daily-rotate-file

Configuration
 - SSH Keys
 - TLS Certs
 
Torque
 - add restriction to existence of multiple and single deps
 
Security
 - https://github.com/krakenjs/lusca

Others
 - VNC
 - Web terminal 
 - Copy files
 - Decompress tar/zip files
 - Use only one SOAP client connection
 - Use only one SSH client connection
 - Use only one RabbitMQ client connection
 - Create a visual tutorial
 - Implement DAG rescue
 - Improve ClassAd parser
 - Use SONARQ
