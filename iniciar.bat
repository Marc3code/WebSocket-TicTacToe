@echo off

:: Abre o servidor em um novo terminal
start cmd /k "cd jogo-da-velha && node server"

:: Abre o cliente em outro terminal
start cmd /k "cd jogo-da-velha-client && npm start"

:: Mensagem no terminal principal
echo Servidor e cliente estão sendo iniciados...
pause
