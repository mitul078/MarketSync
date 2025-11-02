@echo off
echo ========================================
echo  MarketSync - Trading Journal
echo  Starting Development Servers...
echo ========================================
echo.

echo Starting MongoDB connection...
echo (Make sure MongoDB is running on your system)
echo.

echo Starting Express Server...
start cmd /k "cd server && npm start"

timeout /t 3 /nobreak >nul

echo Starting React Client...
start cmd /k "cd client && npm start"

echo.
echo ========================================
echo  Both servers are starting...
echo  Server: http://localhost:5000
echo  Client: http://localhost:3000
echo ========================================
echo.
echo Press any key to close this window...
pause >nul








