@echo off
setlocal
cd /d "%~dp0"
set ERR=0

for %%F in (index.html styles.css app.js v08.js v09.js v10.js v11.js .nojekyll manifest.webmanifest 404.html VERSION SOURCES.md) do (
  if not exist "%%F" (
    echo [MISSING] %%F
    set ERR=1
  )
)

where node >nul 2>nul
if not errorlevel 1 (
  node --check app.js
  if errorlevel 1 set ERR=1
  node --check v08.js
  if errorlevel 1 set ERR=1
  node --check v09.js
  if errorlevel 1 set ERR=1
  node --check v10.js
  if errorlevel 1 set ERR=1
  node --check v11.js
  if errorlevel 1 set ERR=1
  if exist "qa_v08.js" (
    node qa_v08.js
    if errorlevel 1 set ERR=1
  )
  if exist "qa_v09.js" (
    node qa_v09.js
    if errorlevel 1 set ERR=1
  )
  if exist "qa_v10.js" (
    node qa_v10.js
    if errorlevel 1 set ERR=1
  )
  if exist "qa_v11.js" (
    node qa_v11.js
    if errorlevel 1 set ERR=1
  )
) else (
  echo [INFO] 未安裝 Node，略過 JavaScript 語法與 VM 檢查。
)

where python >nul 2>nul
if not errorlevel 1 (
  if exist "qa_audit.py" (
    python qa_audit.py
    if errorlevel 1 set ERR=1
  )
) else (
  echo [INFO] 未安裝 Python，略過內容 QA 檢查。
)

if "%ERR%"=="0" (
  echo [OK] 部署必要檔案與內容 QA 通過。
) else (
  echo [ERROR] 部署包有缺檔或語法問題。
)
pause
exit /b %ERR%
