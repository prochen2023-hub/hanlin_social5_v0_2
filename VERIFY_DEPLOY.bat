@echo off
setlocal
cd /d "%~dp0"
set ERR=0

for %%F in (index.html styles.css app.js .nojekyll manifest.webmanifest 404.html) do (
  if not exist "%%F" (
    echo [MISSING] %%F
    set ERR=1
  )
)

where node >nul 2>nul
if not errorlevel 1 (
  node --check app.js
  if errorlevel 1 set ERR=1
) else (
  echo [INFO] 未安裝 Node，略過 JavaScript 語法檢查。
)

if "%ERR%"=="0" (
  echo [OK] 部署必要檔案齊全。
) else (
  echo [ERROR] 部署包有缺檔或語法問題。
)
pause
exit /b %ERR%
