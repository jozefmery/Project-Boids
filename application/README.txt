File: README.txt
Author: Jozef Méry
Date: 4.5.2020

Prerequisites:

    node.js - version: 12.11.0 (other version are likely to work, but not tested)

All the following command line commands and directory descriptions assume 
the working directory to be the following directory:

    Predator-Prey-Simulation/application

Before the first build, external package dependencies need to be installed
from local/remote locations with the following command: 

    npm run install:all

Building the client only:

    cd client
    npm run build

Now it is possible to use the client by opening the index.html inside 
the client/build directory with a browser.

Building the client and desktop application (using Electron.js):

    cd client
    npm run build:both

Note: For building the desktop application, it is necessary to build the standalone client too,
hence the :both in the command. Now the client is available inside the client/build directory,
same as in the previous guide, and the portable executable desktop application is inside client/electron-build.

Building the server, client and desktop application:

    - OS Windows using a script:
    
        .\build.bat

    - Linux based OS:

        ./build.sh

    - Generic tutorial:

        - run "npm run build:both" inside ./client directory
        - create a ./build directory
        - create a ./build/client directory
        - copy server.js to ./build directory
        - copy contents of ./client/build to ./build/client

        - the built portable desktop application is inside ./client/electron-build 
        and is ready to be used, moved or renamed  

Running the server:

    - OS Windows:
        
        node build\server.js PORT

    - Linux based OS:

        node build/server.js PORT

where PORT is an optional parameter and defaults to 5000.
The application is now accessible at http://localhost:PORT.

The build scripts place the built files inside the build directory,
which can now be renamed or moved. Following the generic tutorial,
it is possible to substitute this directory for any other. The only 
requirement is that server.js and the client directory with the built 
client files are in the same directory. The desktop application is also
placed in the build directory for convenience but is not required by 
the server or client.

Tested desktop browsers (on OS Windows 10, x64):

    - Google Chrome     v83.0
    - Opera             v68.0
    - Mozilla Firefox   v76.0.1

In general, any reasonably modern browser should work, which supports
newer CSS properties, such as the CSS Grid. Outdated browsers such as
Internet Explorer are not supported. Mobile browsers were not tested
as the application is not suited for mobile devices. Due to the nature
of the application, it should work on various operating systems, but the
proper building and running are guaranteed on OS Windows 10, x64. Other
operating systems may require additional software or configuration.

At the time of writing, the application is also available here: 
    
    http://www.stud.fit.vutbr.cz/~xmeryj00/