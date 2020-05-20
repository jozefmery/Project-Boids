File: README.txt
Author: Jozef Méry
Date: 4.5.2020

Prerequisites:

    node.js - version: 12.11.0 (other version are likely to work, but not tested)

The following command line commands assume the working directory to
be the root directory of the application (or this README).

Install required remote packages:

    npm run install:all

Building the client only:

    cd client
    npm run build

Now it is possible to use the client by opening the index.html inside the build directory.

Building the client and desktop application (using electron):

    cd client
    npm run build:both

Note: To build the desktop application it is necessary to build the standalone client too, hence the :both.

Now the client is available inside the build directory same as from the previous guide and
the portable executable desktop application inside electron-build.

Building the server, client and desktop application:

    - Windows using a script:
    
        .\build.bat

    - Linux based systems:

        ./build.sh

    - Generic tutorial:

        - run "npm run build:both" inside ./client directory
        - create a ./build directory
        - create a ./build/client directory
        - copy server.js to ./build directory
        - copy contents of ./client/build to ./build/client

        - the built portable desktop application is inside ./client/electron-build 
        and is ready to be used, moved or renamed  

Run the server:

    - Windows:
        
        node build\server.js PORT

    - Linux:

        node build/server.js PORT

PORT argument is optional and defaults to 5000.
The application is now accesible at http://localhost:PORT.

The build scripts place the built files inside the build directory, which can now
renamed or moved. Following the generic tutorial it is possible to substitute this directory
for any other. The only requirement is that server.js and the client directory with the built
client files are in the same directory. The desktop application is also placed in the build
directory for convenience, but isn't required by the server or client. It is possible to move 
or rename it freely.