#!/usr/bin/bash

# Author: Jozef Méry
# Date: 19.05.2020

# create directory if it doesn't exist
mkdir build -p

# copy server
cp ./server.js ./build/server.js

# build client
cd client
npm run build
cd ..

# copy built client 
cp -r ./client/build/. ./build/client

echo All done