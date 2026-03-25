@echo off
cd /d "%~dp0"
echo Starting Expense Tracker Pro on http://127.0.0.1:8001/
echo.
echo Keep this window open while using the app.
echo Press Ctrl + C to stop the server.
echo.
start "" http://127.0.0.1:8001/
python -m http.server 8001
