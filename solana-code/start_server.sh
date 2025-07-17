#!/bin/bash

echo "🚀 启动Node.js Solana转账服务器..."
echo

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到Node.js，请先安装Node.js"
    echo "下载地址: https://nodejs.org/"
    exit 1
fi

# 检查npm是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 未找到npm，请先安装npm"
    exit 1
fi

echo "✅ Node.js版本: $(node --version)"
echo "✅ npm版本: $(npm --version)"
echo

# 清理旧的依赖并重新安装
if [ -d node_modules ]; then
    echo "📦 清理旧的依赖..."
    rm -rf node_modules package-lock.json
fi

echo "📦 安装依赖包..."
npm install
echo

# 默认使用3000端口，避免权限问题
PORT=3000
echo "✅ 使用端口: ${PORT}"

echo
echo "🌐 启动服务器..."
echo "   服务器地址: http://localhost:${PORT}"
echo "   主页: http://localhost:${PORT}/"
echo "   转账页面: http://localhost:${PORT}/simple_token_transfer.html"
echo

echo "按 Ctrl+C 停止服务器"
echo

# 启动服务器
PORT=$PORT node apache_node_server.js 