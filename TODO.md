Admin
 - Add a workloader administration (and checking)
 - Check if an user is admin
 - Allow an admin to set another user role to admin
 - Add validations to endpoints
 - Add Promise's catches for each bd query
 - Add plugin framework upload
 - Improve plugin editor

App architecture
 - Separate Bussiness logic from Interface

Workloader integration
 - Owner of the dag
 - State of the Workloader
 - State of the Workflow
 - Stop workflow
 - Remove a workflow, all his files and stop the execution
 - Colaborative Dags (the problem here is actually a problem of file sharing)

VFS
 - Add files using CLI (Big files)
 - Copy files
 - Decompress in situ

VFS Store Pluggins:
 - Add plugins for storage services like: S3, HDFS, FTP, MongoGridFS
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
 - Add a CMS for each project

Command Framework
 - Add and review more commands plugins

API Rest
 - Correct the error handling for the rest api
 - Allow a user to change the project name
 - Add a Heartbeat endpoint

Logging
 - Improve logging information
 - Add file rotation winston-daily-rotate-file

Configuration
 - SSH Keys
 - Add for host handling dns

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
 - Implement DAG rescue
 - Use SONARQ
