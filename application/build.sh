#!/usr/bin/bash

# Author: Jozef Méry
# Date: 19.05.2020

# create directory if it doesn't exist
mkdir build -p

# build client
cd client
npm run build:both
cd ..

# copy built client 
cp -r ./client/build/. ./build/client
# copy desktop app
cp -r ./client/electron-build/. .build/electron

echo All done