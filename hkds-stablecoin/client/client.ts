import * as web3 from "@solana/web3.js";
// client.ts
import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
  SystemProgram,
} from "@solana/web3.js";
import {
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
} from "@solana/spl-token";
import {
  createCreateMetadataAccountV3Instruction,
  PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
} from "@metaplex-foundation/mpl-token-metadata";
// Manually initialize variables that are automatically defined in Playground
const PROGRAM_ID = new web3.PublicKey("5LUwc27CZTZhFj5YRVNkhV7ExiiP77TukhZZANMyQZw8");
const connection = new web3.Connection("https://api.devnet.solana.com", "confirmed");
const wallet = { keypair: web3.Keypair.generate() };


// Base58 解码函数，无需依赖 bs58
function decodeBase58(str: string): Uint8Array {
  const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  const base = BigInt(58);
  let decoded = BigInt(0);

  for (let i = 0; i < str.length; i++) {
    const index = alphabet.indexOf(str[i]);
    if (index < 0) throw new Error("Invalid base58 character");
    decoded = decoded * base + BigInt(index);
  }

  const bytes = [];
  while (decoded > 0) {
    bytes.push(Number(decoded % BigInt(256)));
    decoded = decoded / BigInt(256);
  }

  // 处理前导0（在 base58 中是 '1'）
  for (let i = 0; i < str.length && str[i] === "1"; i++) {
    bytes.push(0);
  }

  return new Uint8Array(bytes.reverse());
}

// ====== Configuration ======
const PROGRAM_ID = new PublicKey(
  "5LUwc27CZTZhFj5YRVNkhV7ExiiP77TukhZZANMyQZw8"
);
const DEPLOYER_AUTHORITY = new PublicKey(
  "3fD8rhZnzXQbS7wU7baoLhBXBcMNUS1fgRsSb2Y7J6aK"
);
const connection = new Connection("https://api.devnet.solana.com");

const WALLET_SECRET = new Uint8Array([
  216, 140, 242, 140, 121, 48, 23, 23, 204, 126, 218, 87, 184, 204, 179, 248,
  253, 191, 98, 195, 205, 238, 116, 239, 132, 84, 120, 35, 204, 100, 57, 160,
  39, 129, 42, 140, 188, 36, 114, 90, 112, 112, 245, 176, 68, 179, 250, 19, 196,
  56, 117, 152, 114, 219, 190, 24, 81, 167, 34, 169, 21, 4, 98, 232,
]);

const mint_SECRET = decodeBase58(
  "568MeXHscAAU5pJnXHkUmsU2tLgJMG2Tqq7DmzfntQ98kCmSs6r2TTT1ocB84S9MBwUgRTKCfQyb3RQBi4Xp2jRb"
);

const wallet = Keypair.fromSecretKey(WALLET_SECRET);

(async () => {
  const mint = Keypair.fromSecretKey(mint_SECRET);
  console.log("Using existing mint:", mint.publicKey.toBase58());

  // ====== Metadata ======
  const [metadataPDA] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.publicKey.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  );

  const metadataIx = createCreateMetadataAccountV3Instruction(
    {
      metadata: metadataPDA,
      mint: mint.publicKey,
      mintAuthority: wallet.publicKey, // 这必须是当前 mint 的 mintAuthority
      payer: wallet.publicKey,
      updateAuthority: wallet.publicKey,
    },
    {
      createMetadataAccountArgsV3: {
        data: {
          name: "HKDS Stablecoin",
          symbol: "HKDS",
          uri: `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png`,
          sellerFeeBasisPoints: 0,
          creators: null,
          collection: null,
          uses: null,
        },
        isMutable: true,
        collectionDetails: null,
      },
    }
  );

  await sendAndConfirmTransaction(
    connection,
    new Transaction().add(metadataIx),
    [wallet]
  );

  console.log("Metadata created");
})();
