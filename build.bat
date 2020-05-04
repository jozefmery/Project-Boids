@echo off

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

REM copy starter script
copy .\scripts\start.bat .\build\start.bat

@echo "All done"