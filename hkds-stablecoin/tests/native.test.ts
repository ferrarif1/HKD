import * as web3 from "@solana/web3.js";
// stablecoin.test.ts
import * as splToken from "@solana/spl-token";
// Manually initialize variables that are automatically defined in Playground
const PROGRAM_ID = new web3.PublicKey("5LUwc27CZTZhFj5YRVNkhV7ExiiP77TukhZZANMyQZw8");
const connection = new web3.Connection("https://api.devnet.solana.com", "confirmed");
const wallet = { keypair: web3.Keypair.generate() };


const PROGRAM_ID = new web3.PublicKey(
  "5LUwc27CZTZhFj5YRVNkhV7ExiiP77TukhZZANMyQZw8"
);
const TOKEN_PROGRAM_ID = splToken.TOKEN_PROGRAM_ID;
const MINT = new web3.PublicKey("38X3qPmo4mmPWNLi5ndRiw9e5iLpYQqjD23AYtEHkKXf");
const DEPLOYER_AUTHORITY = new web3.PublicKey(
  "3fD8rhZnzXQbS7wU7baoLhBXBcMNUS1fgRsSb2Y7J6aK"
);

const WALLET_SECRET = new Uint8Array([
  216, 140, 242, 140, 121, 48, 23, 23, 204, 126, 218, 87, 184, 204, 179, 248,
  253, 191, 98, 195, 205, 238, 116, 239, 132, 84, 120, 35, 204, 100, 57, 160,
  39, 129, 42, 140, 188, 36, 114, 90, 112, 112, 245, 176, 68, 179, 250, 19, 196,
  56, 117, 152, 114, 219, 190, 24, 81, 167, 34, 169, 21, 4, 98, 232,
]);

const wallet = web3.Keypair.fromSecretKey(WALLET_SECRET);
wallet.keypair = wallet;
wallet.keypair.publicKey = wallet.publicKey;

let userTokenAccount;
let secondUserTokenAccount;
const SECOND_USER_SECRET = new Uint8Array([
  235, 52, 72, 157, 181, 142, 134, 0, 131, 168, 98, 126, 69, 134, 209, 89, 184,
  143, 12, 120, 44, 251, 190, 212, 245, 133, 45, 143, 234, 220, 84, 238, 113,
  196, 148, 111, 107, 154, 195, 238, 0, 38, 72, 183, 53, 30, 167, 109, 37, 103,
  70, 86, 166, 38, 200, 105, 220, 215, 33, 177, 228, 11, 222, 174,
]);
const secondUser = web3.Keypair.fromSecretKey(SECOND_USER_SECRET);

before("create ATA", async () => {
  userTokenAccount = await splToken.getAssociatedTokenAddress(
    MINT,
    wallet.publicKey
  );
  try {
    const tx = new web3.Transaction().add(
      splToken.createAssociatedTokenAccountInstruction(
        wallet.publicKey,
        userTokenAccount,
        wallet.publicKey,
        MINT
      )
    );
    await web3.sendAndConfirmTransaction(connection, tx, [wallet]);
  } catch (_) {}

  secondUserTokenAccount = await splToken.getAssociatedTokenAddress(
    MINT,
    secondUser.publicKey
  );
  try {
    const tx = new web3.Transaction().add(
      splToken.createAssociatedTokenAccountInstruction(
        wallet.publicKey,
        secondUserTokenAccount,
        secondUser.publicKey,
        MINT
      )
    );
    await web3.sendAndConfirmTransaction(connection, tx, [wallet]);
  } catch (_) {}
});

describe("Stablecoin Tests", () => {
  it("ManualMint to wallet", async () => {
    const data = Buffer.alloc(9);
    data.writeUInt8(0, 0);
    data.writeBigUInt64LE(BigInt(1_000_000), 1);

    const ix = new web3.TransactionInstruction({
      keys: [
        { pubkey: DEPLOYER_AUTHORITY, isSigner: true, isWritable: false },
        { pubkey: MINT, isSigner: false, isWritable: true },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        { pubkey: userTokenAccount, isSigner: false, isWritable: true },
      ],
      programId: PROGRAM_ID,
      data,
    });
    const tx = new web3.Transaction().add(ix);
    await web3.sendAndConfirmTransaction(connection, tx, [wallet]);
  });

  it("TransferToUser", async () => {
    const data = Buffer.alloc(9);
    data.writeUInt8(1, 0);
    data.writeBigUInt64LE(BigInt(100_000), 1);

    const ix = new web3.TransactionInstruction({
      keys: [
        { pubkey: DEPLOYER_AUTHORITY, isSigner: true, isWritable: false },
        { pubkey: MINT, isSigner: false, isWritable: true },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        { pubkey: userTokenAccount, isSigner: false, isWritable: true },
        { pubkey: secondUserTokenAccount, isSigner: false, isWritable: true },
      ],
      programId: PROGRAM_ID,
      data,
    });
    const tx = new web3.Transaction().add(ix);
    await web3.sendAndConfirmTransaction(connection, tx, [wallet]);
  });

  it("BurnFromUser", async () => {
    const data = Buffer.alloc(9);
    data.writeUInt8(2, 0);
    data.writeBigUInt64LE(BigInt(1000), 1);

    const ix = new web3.TransactionInstruction({
      keys: [
        { pubkey: DEPLOYER_AUTHORITY, isSigner: true, isWritable: false },
        { pubkey: userTokenAccount, isSigner: false, isWritable: true },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        { pubkey: MINT, isSigner: false, isWritable: true },
      ],
      programId: PROGRAM_ID,
      data,
    });
    const tx = new web3.Transaction().add(ix);
    await web3.sendAndConfirmTransaction(connection, tx, [wallet]);
  });

  it("AddToBlacklist (mock)", async () => {
    const data = Buffer.from([3]);
    const ix = new web3.TransactionInstruction({
      keys: [
        { pubkey: DEPLOYER_AUTHORITY, isSigner: true, isWritable: false },
        { pubkey: MINT, isSigner: false, isWritable: false },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        { pubkey: userTokenAccount, isSigner: false, isWritable: false },
      ],
      programId: PROGRAM_ID,
      data,
    });
    const tx = new web3.Transaction().add(ix);
    await web3.sendAndConfirmTransaction(connection, tx, [wallet]);
  });

  it("RemoveFromBlacklist (mock)", async () => {
    const data = Buffer.from([4]);
    const ix = new web3.TransactionInstruction({
      keys: [
        { pubkey: DEPLOYER_AUTHORITY, isSigner: true, isWritable: false },
        { pubkey: MINT, isSigner: false, isWritable: false },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        { pubkey: userTokenAccount, isSigner: false, isWritable: false },
      ],
      programId: PROGRAM_ID,
      data,
    });
    const tx = new web3.Transaction().add(ix);
    await web3.sendAndConfirmTransaction(connection, tx, [wallet]);
  });
});
