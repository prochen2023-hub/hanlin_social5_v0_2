@echo off
setlocal
cd /d "%~dp0"

where git >nul 2>nul
if errorlevel 1 (
  echo [ERROR] 找不到 Git。請先安裝 Git for Windows。
  pause
  exit /b 1
)

for /f "delims=" %%B in ('git branch --show-current 2^>nul') do set "BRANCH=%%B"
if /I not "%BRANCH%"=="deploy" (
  echo [STOP] 目前 branch 是 "%BRANCH%"，不是 deploy。
  echo 請先把這整包內容放到 deploy branch 根目錄，再執行本檔。
  pause
  exit /b 2
)

git add -A

git diff --cached --quiet
if not errorlevel 1 (
  echo [INFO] 沒有新的變更需要提交。
) else (
  git commit -m "deploy: update social5 site"
  if errorlevel 1 goto :fail
)

git push -u origin deploy
if errorlevel 1 goto :fail

echo.
echo [OK] deploy branch 已推送到 origin。
pause
exit /b 0

:fail
echo.
echo [ERROR] Git 操作失敗，請查看上方訊息。
pause
exit /b 3
