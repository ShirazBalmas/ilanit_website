@echo off
rem Starts the local MongoDB database (run this before "npm run dev" if MongoDB is not already running)
if not exist "%USERPROFILE%\mongodb-data" mkdir "%USERPROFILE%\mongodb-data"
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath "%USERPROFILE%\mongodb-data" --port 27017
