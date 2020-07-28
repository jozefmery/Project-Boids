File: README.txt
Author: Jozef Méry
Date: 4.5.2020

Prerequisites (other version are likely to work, but were not tested):
    
    node.js - v12.11.0
    npm - v6.11.3 (usually installed together with node.js)


All the following command line commands and directory descriptions assume the working directory to
be the following directory:
    
    Predator-Prey-Simulation/application.

Before the first build, external package dependencies need to be installed from local/remote locations with the following command: 

    npm run install:all

Running the client development server:

    npm run client

Building the client only:

    cd client
    npm run build

Now, it is possible to run the client by opening the index.html inside the client/build directory with a browser. 

Building the client and desktop application (using Electron.js):

     cd client
     npm run build:both

Note: For building the desktop application, it is necessary to build the standalone client, hence the ":both" in the command. 
Now the client is available inside the \textit{client/build} directory, same as in the previous guide, and the portable executable
desktop application is inside client/electron-build. Electron.js might add other files in this directory but they are not needed 
to run the application. 

Building the server, client and desktop application:

    OS Windows using a script:
        
        .\build.bat

     Linux based OS using a script:
        
        ./build.sh
    
     Generic steps:
        
        run "npm run build:both" inside the client directory
        create a build directory
        create a build/client directory
        copy server.js to the build directory
        copy contents of client/build to build/client
        the built portable desktop application is inside client/electron-build and is ready to be used, moved or renamed  

The server.js cannot be moved out of the development directory because its dependencies are located in the node_modules directory. 
The desktop application is also placed in the build directory for convenience but is not required by the server or client.

Running the server:
    
    OS Windows:
            
        node build\textbackslash server.js PORT

    Linux based OS:
        
        node build/server.js PORT

where PORT is an optional parameter and defaults to 5000. 
The application is now accessible at http://localhost:PORT.

Tested desktop browsers (on OS Windows 10, x64):

    Google Chrome v83.0
    Opera v68.0
    Mozilla Firefox v76.0.1

In general, any reasonably modern browser should work, which supports newer CSS properties, such as the CSS Grid. 
Outdated browsers such as Internet Explorer are not supported. Mobile browsers were not tested as the application 
is not suited for mobile devices. Due to the nature of the application, it should work on various operating systems, 
but the proper building and running are guaranteed on OS Windows 10, x64. Other operating systems may require additional 
software or configuration.

At the time of writing, the application is available here: 

    http://www.stud.fit.vutbr.cz/~xmeryj00/