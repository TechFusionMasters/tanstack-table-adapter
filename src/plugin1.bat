@echo off
rem ──────────────────────────────────────────────────────────────
rem collect_plugin.bat
rem Recursively gathers all .ts/.tsx files and concatenates
rem them into plugin.txt in this folder.
rem ──────────────────────────────────────────────────────────────

setlocal enabledelayedexpansion

rem Define output file (same folder as this script)
set "output=%~dp0plugin.txt"

rem Remove any existing plugin.txt
if exist "%output%" del "%output%"

rem Walk the directory tree and process each .ts and .tsx file
for /R "%~dp0" %%F in (*.ts *.tsx) do (
    rem Write a simple header with the relative path
    echo // ---- File: %%~pnxF ---->>"%output%"
    rem Append the file contents
    type "%%F">>"%output%"
    rem Blank line between files
    echo.>>"%output%"
)

echo.
echo Collected all .ts/.tsx files into:
echo    %output%
echo.
pause
