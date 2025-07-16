@REM xcopy "D:\learn\teamclash" "C:\NavnitImportantDonttouch" /E /I /H /Y

robocopy "D:\learn\teamclash" "C:\NavnitImportantDonttouch" /E ^
/XD "D:\learn\teamclash\backend\node_modules" "D:\learn\teamclash\frontend\node_modules" ^
/XF "file1.txt" "file2.log"

