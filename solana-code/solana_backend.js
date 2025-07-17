// solana_backend.js
const express = require('express');
const cors = require('cors');
const { Connection, PublicKey, Transaction, SystemProgram, clusterApiUrl } = require('@solana/web3.js');
const { getAssociatedTokenAddress, createTransferInstruction, getAccount, createAssociatedTokenAccountInstruction } = require('@solana/spl-token');

const app = express();
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000']
}));
app.use(express.json());

const SOL_MINT = 'So11111111111111111111111111111111111111112'; // 伪mint，前端用空或此值表示SOL

// 获取 SPL Token decimals（默认6位，USDC/USDT等）
async function getTokenDecimals(connection, mintAddress) {
  try {
    const info = await connection.getParsedAccountInfo(new PublicKey(mintAddress));
    return info.value?.data?.parsed?.info?.decimals ?? 6;
  } catch {
    return 6;
  }
}

app.post('/api/assemble-transfer', async (req, res) => {
  try {
    console.log('收到转账请求:', req.body);
    const { from, to, amount, tokenMint } = req.body;
    if (!from || !to || !amount) return res.status(400).json({ error: 'Missing params' });

    console.log('正在连接 Solana 节点...');
    const connection = new Connection('https://mainnet.helius-rpc.com/?api-key=52c86faf-c163-4dab-8b47-8727c34dba61');
    
    console.log('正在获取 blockhash...');
    const recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    console.log('获取到 blockhash:', recentBlockhash);
    
    const feePayer = new PublicKey(from);

    let tx = new Transaction({ recentBlockhash, feePayer });

    if (!tokenMint || tokenMint === SOL_MINT) {
      // SOL 转账
      tx.add(SystemProgram.transfer({
        fromPubkey: feePayer,
        toPubkey: new PublicKey(to),
        lamports: Number(amount), // 前端需传 lamports
      }));
    } else {
      // SPL Token 转账
      const mint = new PublicKey(tokenMint);
      const fromTokenAccount = await getAssociatedTokenAddress(mint, feePayer);
      const toTokenAccount = await getAssociatedTokenAddress(mint, new PublicKey(to));
      // 检查目标 ATA 是否存在
      let toTokenAccountInfo;
      try {
        toTokenAccountInfo = await getAccount(connection, toTokenAccount);
      } catch (e) {
        toTokenAccountInfo = null;
      }
      if (!toTokenAccountInfo) {
        // 目标 ATA 不存在，先创建
        tx.add(createAssociatedTokenAccountInstruction(
          feePayer, // payer
          toTokenAccount, // ata
          new PublicKey(to), // owner
          mint // mint
        ));
      }
      tx.add(createTransferInstruction(
        fromTokenAccount,
        toTokenAccount,
        feePayer,
        Number(amount)
      ));
    }

    const serialized = tx.serialize({ requireAllSignatures: false }).toString('base64');
    res.json({ tx: serialized });
  } catch (e) {
    console.error('后端错误:', e);
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/get-balance', async (req, res) => {
  try {
    const { address } = req.body;
    if (!address) return res.status(400).json({ error: 'Missing address' });
    const connection = new Connection('https://mainnet.helius-rpc.com/?api-key=52c86faf-c163-4dab-8b47-8727c34dba61');
    const bal = await connection.getBalance(new PublicKey(address));
    res.json({ balance: bal });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(3001, () => console.log('Solana backend API running on :3001')); 