@echo off

REM Author: Jozef Méry
REM Date: 19.05.2020

REM create directory if it doesn't exist
if not exist build md build

REM copy server
copy .\server.js .\build\server.js

REM build client
cd client
call npm run build
cd ..

REM copy built client 
robocopy .\client\build .\build\client /E

@echo "All done"