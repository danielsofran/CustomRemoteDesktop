Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "cmd.exe /c node C:\Users\aerap\Desktop\Projects\remotedesktop\index.js > C:\Users\aerap\Desktop\Projects\remotedesktop\logs\output.log 2>C:\Users\aerap\Desktop\Projects\remotedesktop\logs\error.log", 0, False
