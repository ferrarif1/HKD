

---

# 💱 HKDS 稳定币合约（Solana Devnet）

本项目包含一个基于 Solana 的稳定币合约，支持以下核心功能：

* 铸币（Mint）功能，仅限监管地址使用
* 用户之间的转账功能
* 销毁代币（Burn）功能
* 模拟黑名单控制逻辑（Mock）

该合约已在 **Solana Devnet** 成功部署，并绑定代币 `HKDS` 的 Metadata，包括图标、名称与符号。

---

## 📁 项目结构

```
.
├── src/
│   └── lib.rs                // 稳定币合约主逻辑（Rust）
├── client.ts                 // 创建 Mint 并写入元数据（TypeScript）
├── native.test.ts           // 测试用例（旧版）
├── stablecoin.test.ts       // 主测试脚本（新版本，用于验证合约逻辑）
├── Cargo.toml               // Rust 项目配置
└── README.md                // 本说明文档
```

---

## 🧱 合约部署地址

| 类型           | 公钥                                                                                                       |
| ------------ | -------------------------------------------------------------------------------------------------------- |
| 合约程序 ID      | `5LUwc27CZTZhFj5YRVNkhV7ExiiP77TukhZZANMyQZw8`                                                           |
| HKDS Mint 地址 | `38X3qPmo4mmPWNLi5ndRiw9e5iLpYQqjD23AYtEHkKXf`                                                           |
| Metadata 查看  | [Solscan](https://solscan.io/token/38X3qPmo4mmPWNLi5ndRiw9e5iLpYQqjD23AYtEHkKXf?cluster=devnet#metadata) |

---

## 🛠 部署步骤

### 1. 编译部署合约（在 Solana Playground）

使用 Anchor 编译部署：

```bash
anchor build
anchor deploy
```

或者直接上传 `lib.rs` 到 [https://beta.solpg.io](https://beta.solpg.io) 并点击 Deploy。

### 2. 设置代币元数据

在 `client.ts` 中执行以下逻辑：

* 使用已有密钥导入 Mint 地址
* 使用 Metaplex Metadata program 创建 token metadata
* URI 指向 USDT 图标：

```ts
uri: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png"
```

运行方式：

```bash
ts-node client.ts
```

---

## ✅ 支持指令功能（来自 Rust 合约）

| 指令编号 | 功能说明             | 附加参数         |
| ---- | ---------------- | ------------ |
| `0`  | 手动铸币（ManualMint） | `u64 amount` |
| `1`  | 转账至用户（Transfer）  | `u64 amount` |
| `2`  | 销毁用户代币（Burn）     | `u64 amount` |
| `3`  | 加入黑名单（Mock）      | 无            |
| `4`  | 移除黑名单（Mock）      | 无            |

---

## 🧪 测试方法

打开 `stablecoin.test.ts` 并运行：

```bash
ts-node stablecoin.test.ts
```

### 测试内容包括：

* ✅ 铸币给监管地址的 ATA
* ✅ 从监管地址向用户转账
* ✅ 用户销毁指定数量代币
* ✅ 模拟黑名单添加/移除逻辑

你将在控制台看到交易成功记录和输出日志。

---

## 🧩 关于 metadata 绑定

Token Metadata 不直接绑定到程序（合约），而是绑定到某个 Mint 地址。

只需在 `client.ts` 中调用：

```ts
createCreateMetadataAccountV3Instruction(...)
```

并在 `metadataPDA` 使用：

```ts
PublicKey.findProgramAddressSync([
  Buffer.from("metadata"),
  TOKEN_METADATA_PROGRAM_ID.toBuffer(),
  mint.publicKey.toBuffer(),
])
```

即代表将这个 Metadata 与 `mint` 地址永久绑定（可查看 Solscan）。

**合约逻辑中无需管理元数据，元数据不影响合约逻辑，仅用于 UI 展示和钱包识别。**

---

## 👤 权限说明

* 所有敏感指令（Mint、Burn、Transfer）只能由部署者（Deployer）执行。
* 通过 `DEPLOYER_AUTHORITY` 常量控制，拒绝其他账户操作。

---

## 🔐 私钥说明

合约部署使用的账户为：

```ts
const DEPLOYER_AUTHORITY = new PublicKey("3fD8rhZnzXQbS7wU7baoLhBXBcMNUS1fgRsSb2Y7J6aK");
```

私钥保存在本地 `Uint8Array` 中，并传入 `Keypair.fromSecretKey(...)` 使用。

---

## 🌐 演示链配置

* 网络：Solana Devnet
* 区块浏览器： [https://solscan.io](https://solscan.io/?cluster=devnet)

