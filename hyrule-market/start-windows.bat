@echo off
rem HYRULE MARKET をローカルで開きます（Windows）。終了はこのウィンドウを閉じてください。
cd /d "%~dp0"
start "" http://localhost:8080/
python -m http.server 8080
