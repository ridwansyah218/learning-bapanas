@echo off
start "Moodle database" /b "%~dp0.local\mariadb\mariadb-10.11.16-winx64\bin\mariadbd.exe" --defaults-file="%~dp0.local\mariadb\data\my.ini"
