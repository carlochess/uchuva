Arch
 - Separate Bussiness logic from Interface
 
Admin
 - Add users management
 - CRUD: Dag, DagExe, Files, Programs, User (agregar, eliminar, detalles, actualizar, listar, descargar, cargar)
 - Manage offered apps and programs
 - Manage offered workload managers

Workloader integration
 - Separate in plugins the Workloader interactions
 - Create an interface for the above requirement
 - Owner of the dag
 - State of the Workloader
 - State of the workflow
 - Stop workflow
 - Remove a workflow
 - When a DAG is deleted, stop the execution

Torque
 - add restriction to restrict the mix of multiple and single deps

VFS
 - Add files using CLI (Big files)
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

ELK
 - Create a Dashboard

GUI
 - Improve command framework gui
 - Improve lateral menu
 - Fix /build log/out/err node information

Command Framework
 - Add and review more commands plugins

API Rest
 - Correct the error handling for the rest api
 - Change the project name
 - Add a Heart beat end point

Logging
 - Better logging information
 - Add file rotation winston-daily-rotate-file

Configuration
 - SSH Keys

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
