@echo off
chcp 65001 > nul
echo ====================================================
echo  正在啟動 RoomCraft 3D 空間映象...
echo ====================================================
cd /d "%~dp0"
node local_server.js
pause
