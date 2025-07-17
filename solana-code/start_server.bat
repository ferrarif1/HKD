@echo off
chcp 6501nul
echo 🚀 启动Node.js Apache替代服务器...
echo.

REM 检查Node.js是否安装
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未找到Node.js，请先安装Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

REM 检查npm是否安装
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未找到npm，请先安装npm
    pause
    exit /b 1
)

echo ✅ Node.js版本: 
node --version
echo ✅ npm版本: 
npm --version
echo.

REM 检查依赖是否安装
if not existnode_modules(
    echo 📦 安装依赖包...
    npm install
    echo.
)

REM 检查端口80否被占用
netstat -an | findstr :80  >nul
if not errorlevel1 (
    echo ⚠️  警告: 端口80被占用
    echo    正在使用端口3000
    set PORT=3000
) else (
    echo ✅ 端口80用
)

echo.
echo 🌐 启动服务器...
echo    服务器地址: http://localhost:%PORT%
echo    主页: http://localhost:%PORT%/
echo    转账页面: http://localhost:%PORT%/simple_token_transfer.html
echo.
echo 按Ctrl+C 停止服务器
echo.

REM 启动服务器
node apache_node_server.js 