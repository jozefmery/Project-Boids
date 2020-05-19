File: README.txt
Author: Jozef Méry
Date: 4.5.2020

Prerequisites:

    node.js - version: 12.11.0 (other version are likely to work, but not tested)

The following command line commands assume the working directory to
be the root directory of the application (or this README).

Install required remote packages:

    npm run install-all

Build the server and client:

    - Windows using a script:
    
        ./build.bat

    - Linux based systems:

        ./build.sh

    - Generic tutorial:

        - run "npm run build" inside ./client directory
        - create a ./build directory
        - create a ./build/client directory
        - copy server.js to ./build directory
        - copy contents of ./client/build to ./build/client

Run the server:

    - Windows:
        
        node build\server.js PORT

    - Linux:

        node build/server.js PORT

PORT argument is optional and defaults to 5000