const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000; // Mac上默认使用3000端口

// 中间件配置
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 静态文件服务
app.use(express.static(__dirname));

// 路由：主页
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Solana转账服务</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
                body {
                    font-family: -apple-sys
                    tem, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    padding: 2em;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    margin: 0;
                    min-height: 100vh;
                }
                .container {
                    max-width: 800px;
                    margin: 0 auto;
                    background: white;
                    padding: 2em;
                    border-radius: 15px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                }
                h1 {
                    text-align: center;
                    color: #333;
                    margin-bottom: 1em;
                }
                .link {
                    display: block;
                    margin: 1em 0;
                    padding: 1.5em;
                    background: linear-gradient(135deg, #f93f3b 0%, #f5576c 100%);
                    text-decoration: none;
                    color: white;
                    border-radius: 10px;
                    text-align: center;
                    font-weight: bold;
                    transition: transform 0.2s;
                }
                .link:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                }
                .status {
                    padding: 1em;
                    margin: 1em 0;
                    border-radius: 10px;
                    background: #e8f5e9;
                    color: #2e7d32;
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🌞 Solana转账服务</h1>
                <div class="status">
                    ✅ Node.js服务器运行正常 | 端口: ${PORT}
                </div>
                <h2>📱 转账页面</h2>
                <a href="/simple_token_transfer.html" class="link">
                    🚀 开始转账 (支持SOL和SPL代币)
                </a>
                <h2>📊 服务器信息</h2>
                <a href="/api/status" class="link">🔍 查看服务器状态</a>
            </div>
        </body>
        </html>
    `);
});

// API路由：服务器状态
app.get('/api/status', (req, res) => {
    res.json({
        status: 'running',
        server: 'Solana转账服务',
        port: PORT,
        timestamp: new Date().toISOString(),
        platform: process.platform,
        features: [
            'Phantom钱包连接',
            'SOL转账',
            'SPL代币转账',
            '实时余额查询',
            '交易状态显示'
        ]
    });
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    res.status(500).json({
        success: false,
        error: '服务器内部错误',
        message: err.message
    });
});

// 404处理
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: '页面不存在',
        path: req.path,
        method: req.method
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`🚀 Solana转账服务启动成功！`);
    console.log(`📡 服务器地址: http://localhost:${PORT}`);
    console.log(`📁 静态文件目录: ${__dirname}`);
    console.log(`🌐 CORS支持: 已启用`);
    console.log(`\n📱 转账页面:`);
    console.log(`   http://localhost:${PORT}/simple_token_transfer.html`);
    console.log(`\n💡 提示: 在Mac上按 Cmd+C 停止服务器`);
}); 