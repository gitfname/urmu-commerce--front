@echo off
setlocal enabledelayedexpansion

echo Starting file collection...
set "output=all-files.txt"

:: Remove existing output file
if exist "%output%" del "%output%"

:: Write header with clear structure
echo PROJECT FILES COLLECTION > "%output%"
echo Generated: %date% %time% >> "%output%"
echo Total Directory: %cd% >> "%output%"
echo. >> "%output%"
echo ================================== >> "%output%"
echo TABLE OF CONTENTS >> "%output%"
echo ================================== >> "%output%"

:: Counter for files
set /a count=0

:: First pass - create table of contents
for /r %%f in (*.*) do (
 :: Skip the output file itself and the batch script
 if /i not "%%~nxf"=="%output%" (
 if /i not "%%~nxf"=="collect-files.bat" (
 :: Get relative path
 set "filepath=%%f"
 set "relativepath=!filepath:%cd%\=!"
 
 :: Skip common binary/system files
 set "skip=0"
 if /i "%%~xf"==".exe" set "skip=1"
 if /i "%%~xf"==".dll" set "skip=1"
 if /i "%%~xf"==".bin" set "skip=1"
 if /i "%%~xf"==".zip" set "skip=1"
 if /i "%%~xf"==".jpg" set "skip=1"
 if /i "%%~xf"==".png" set "skip=1"
 if /i "%%~xf"==".gif" set "skip=1"
 if /i "%%~xf"==".pdf" set "skip=1"
 if /i "%%~xf"==".mp3" set "skip=1"
 if /i "%%~xf"==".mp4" set "skip=1"
 if /i "%%~xf"==".avi" set "skip=1"
 
 if "!skip!"=="0" (
 echo !relativepath! >> "%output%"
 set /a count+=1
 )
 )
 )
)

echo. >> "%output%"
echo ================================== >> "%output%"
echo FILE CONTENTS ^(%count% files^) >> "%output%"
echo ================================== >> "%output%"
echo. >> "%output%"

:: Second pass - add file contents
for /r %%f in (*.*) do (
 :: Skip the output file itself and the batch script
 if /i not "%%~nxf"=="%output%" (
 if /i not "%%~nxf"=="collect-files.bat" (
 :: Get relative path
 set "filepath=%%f"
 set "relativepath=!filepath:%cd%\=!"
 
 :: Skip common binary/system files
 set "skip=0"
 if /i "%%~xf"==".exe" set "skip=1"
 if /i "%%~xf"==".dll" set "skip=1"
 if /i "%%~xf"==".bin" set "skip=1"
 if /i "%%~xf"==".zip" set "skip=1"
 if /i "%%~xf"==".jpg" set "skip=1"
 if /i "%%~xf"==".png" set "skip=1"
 if /i "%%~xf"==".gif" set "skip=1"
 if /i "%%~xf"==".pdf" set "skip=1"
 if /i "%%~xf"==".mp3" set "skip=1"
 if /i "%%~xf"==".mp4" set "skip=1"
 if /i "%%~xf"==".avi" set "skip=1"
 
 if "!skip!"=="0" (
 echo Processing: !relativepath!
 
 :: Clear file separator with consistent format
 echo. >> "%output%"
 echo - START FILE: !relativepath! >> "%output%"
 
 :: Add file content (with error handling)
 type "%%f" >> "%output%" 2>nul || echo [ERROR: Could not read file] >> "%output%"
 
 echo. >> "%output%"
 echo - END FILE: !relativepath! >> "%output%"
 echo. >> "%output%"
 )
 )
 )
)

echo. >> "%output%"
echo ================================== >> "%output%"
echo SUMMARY >> "%output%"
echo ================================== >> "%output%"
echo Total files processed: %count% >> "%output%"
echo Generation completed: %date% %time% >> "%output%"

echo.
echo Done! Processed %count% files.
echo Output written to: %output%
echo This format is optimized for AI model consumption.
pause