# Solana Phantom 钱包转账 Demo 使用说明

本项目提供了一个基于 Node.js + HTML 的 Solana 钱包转账演示，支持 Phantom 钱包连接，支持 SOL 和任意 SPL Token（如 USDC、USDT、自定义 Mint）转账。

---

## 1. 环境准备

- 需安装 Node.js（建议 v16+）
- 需安装 npm
- 需安装 Phantom 钱包浏览器插件

---

## 2. 安装依赖

在 `solanax` 目录下执行：

```sh
npm install
```

如未自动安装 express、@solana/web3.js、@solana/spl-token、cors，可手动安装：

```sh
npm install express @solana/web3.js @solana/spl-token cors
```

---

## 3. 启动后端 API 服务

```sh
node solana_backend.js
```

- 默认监听 3001 端口
- 已配置 CORS，允许本地前端跨域访问
- 使用你专属的 Solana RPC 节点（extrnode.com）

---

## 4. 启动前端静态服务器

可用本项目自带的 `apache_node_server.js`：

```sh
node apache_node_server.js
```

- 默认监听 3000 端口
- 也可用其他静态服务器（如 live-server、http-server 等）

---

## 5. 使用前端页面

1. 浏览器访问：
   
   ```
   http://localhost:3000/simple_token_transfer.html
   ```

2. 连接 Phantom 钱包
3. 输入收款地址、选择代币（SOL/USDC/USDT/自定义 Mint）、输入数量
4. 点击“发起转账”，在 Phantom 钱包弹窗中签名
5. 成功后页面显示交易ID，可点击跳转 solscan 查看

---

## 6. 支持的功能

- 支持 Phantom 钱包连接与断开
- 支持 SOL、USDC、USDT 及自定义 SPL Token（输入 Mint 地址）转账
- 自动将金额转换为最小单位（SOL: 1e9, USDC/USDT: 1e6, 自定义默认1e6）
- 后端负责组装和序列化交易，前端只负责签名和广播，安全合规

---

## 7. 常见问题排查

- **CORS 错误**：请确保 `solana_backend.js` 已正确引入并配置 cors。
- **fetch failed / 403 Forbidden**：请检查 Solana RPC 节点是否可用，建议使用专属节点。
- **Phantom 钱包无法连接**：请确保浏览器已安装 Phantom 插件，且页面用 http(s) 协议访问。
- **余额/转账失败**：请检查钱包余额、目标地址、代币 Mint 是否正确。
- **端口冲突**：如 3000/3001 被占用，可修改端口后同步修改前端 fetch 地址。

---

## 8. 参考
- [Phantom 钱包官网](https://phantom.app/)
- [Solana Web3.js 文档](https://solana-labs.github.io/solana-web3.js/)
- [SPL Token JS 文档](https://solana-labs.github.io/solana-program-library/token/js/)

---

# 🌞 Solana 代币转账应用

这是一个完整的Solana代币转账应用，包含前端HTML页面和后端Node.js服务，支持Phantom钱包连接。

## 📁 文件结构

```
├── apache_node_server.js          # Node.js服务器
├── simple_token_transfer.html     # 前端转账页面
├── package.json                   # 项目依赖配置
├── start_server.sh                # Linux/Mac启动脚本
├── start_server.bat               # Windows启动脚本
└── README.md                      # 项目说明文档
```

## 🚀 快速开始

### Mac/Linux用户：
```bash
# 给启动脚本执行权限
chmod +x start_server.sh

# 启动服务器
./start_server.sh
```

### Windows用户：
```cmd
# 双击运行或在命令行执行
start_server.bat
```

### 手动启动：
```bash
# 安装依赖
npm install

# 启动服务器
npm start
# 或者
node apache_node_server.js
```

## 🌐 访问地址

启动服务器后，可以访问以下页面：

- **主页**: http://localhost:3000/
- **转账页面**: http://localhost:3000/simple_token_transfer.html

## 🔧 功能特性

### 服务器功能
- ✅ 静态文件服务
- ✅ CORS支持
- ✅ 服务器状态监控
- ✅ 错误处理

### 前端功能
- ✅ 连接Phantom钱包
- ✅ 显示钱包地址和余额
- ✅ 支持SOL和SPL代币转账
- ✅ 实时余额查询
- ✅ 交易状态显示
- ✅ 响应式设计

## 📖 使用说明

### 1. 启动服务器
```bash
# 使用启动脚本（推荐）
./start_server.sh

# 或手动启动
npm install
node apache_node_server.js
```

###2问页面
- 打开浏览器访问 http://localhost:300
- 点击"开始转账"按钮
- 或者直接访问 http://localhost:3000/simple_token_transfer.html

### 3 使用转账功能
1 点击连接Phantom钱包按钮
2. 在Phantom钱包中确认连接
3 选择要转账的代币类型（SOL或SPL代币）
4 输入接收地址和转账金额5. 点击"发送代币完成转账

## 🔗 API接口

### 服务器状态
```bash
GET /api/status
```

## 🛠️ 技术栈

### 服务器
- Node.js
- Express.js
- CORS中间件

### 前端
- HTML5 + CSS3 + JavaScript (ES6+)
- Solana Web3.js
- SPL Token库

## 🔒 安全注意事项

1. **私钥安全**: 私钥永远不会离开用户的浏览器2 **网络安全**: 使用HTTPS在生产环境中部署3 **地址验证**: 始终验证输入的地址格式4. **金额验证**: 检查转账金额和余额5 **测试网络**: 建议先在Devnet测试

## 🐛 常见问题

### Q: 无法连接Phantom钱包？
A: 确保已安装Phantom扩展，并且浏览器允许弹窗。

### Q: 转账失败？
A: 检查网络连接、余额是否充足、地址是否正确。

### Q: 端口被占用？
A: 服务器默认使用300，如需修改可在启动脚本中更改PORT变量。

## 📚 学习资源

- [Solana官方文档](https://docs.solana.com/)
- [Phantom钱包文档](https://docs.phantom.app/)
-Solana Web3.js文档](https://solana-labs.github.io/solana-web3js/)

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

感谢Solana团队和Phantom团队提供的优秀工具和文档。 