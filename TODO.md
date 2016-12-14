Arch
 - Separate Bussiness logic from Interface
 
Admin
 - Users management
 - CRUD: Dag, DagExe, Files, Programs, User (agregar, eliminar, detalles, actualizar, listar, descargar, cargar)
 - Manage offerted apps and programs
 - Review express admin 
 - Grafana dashboards

Workloader integration
 - Separate in plugins the Workloader interactions
 - Create an interface for the above requirement
 - Add HTCondor fork/join and SSH handler 
 - Owner of the dag
 - Try BOSCO, Native bindings, java CGOI
 - Review each C API binding
 - State of the Workloader
 - State of the workflow
 - Stop workflow
 - Pause a workflow
 - Remove a workflow
 - When a DAG is deleted, stop the execution

Torque
 - add restriction to restrict the mix of multiple and single deps

VFS
 - Allow download for results
 - Catch errors in API
 - Add files using GUI
 - Add files using CLI (Big files)
 - Error looking content of the file
 - Add a text editor

VFS Store Pluggins: 
 - Add  for the storage: S3, HDFS, FTP, MongoGridFS
 - Add file retrival for that platforms
 - ...
 
Windows support
 - Check for HTCondor configuration

Testing
 - Improve Selenium test
 - Create more Unit tests
 - Create JMeter test
 
CI/CD
 - Use at least two git branch
 - Publicar en NPM y en Heroku
 - Improve deb package
 - Add unit/integration test to the pipeline

ELK
 - Create a Dashboard

GUI
 - Improve command framework gui
 - Improve lateral 
 - Fix /build log/out/err node information
 - Fix 

Command Framework
 - Add and review more commands plugins

API Rest
 - Inprove the REST clients examples (ruby for the obvious, racket for the unmaginable)
 - Correct the error handling for the rest api
 - Change the project name
 - Heart beat end point

Logging
 - Kibana dashboard
 - Better logging information
 - Add [syslogs](https://github.com/winstonjs/winston-syslog)
 - Add file rotation winston-daily-rotate-file
 - Check for node-loggly

Must do
 - There is a problem with the double quotes in the 
 - Archivo que no existen
 - Look for graph renderers (90%)

Configuration
 - SSH Keys

Security
 - https://github.com/krakenjs/lusca
 - HTTPS

Others
 - VNC
 - Web terminal 
 - Copy files
 - Decompress tar/zip files
 - Use only one SOAP client
 - Create a visual tutorial
 - Implement DAG rescue
 - Improve ClassAd parser
 - Split the runner 
 - Allow job routing using [Redis](https://gist.github.com/pietern/348262)
 - Use SONARQ
