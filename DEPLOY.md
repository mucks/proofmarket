# 🚀 Quick Deployment Guide

Deploy the contract to BSC Testnet with minimal setup!

## Prerequisites

1. **Get your private key from MetaMask:**
   - Open MetaMask
   - Click the three dots next to your account
   - Account Details > Export Private Key
   - ⚠️ **NEVER share or commit this key!**

2. **Get testnet BNB:**
   - Visit https://testnet.binance.org/faucet-smart
   - Enter your wallet address
   - Claim 0.5 tBNB (free testnet tokens)

## Deploy to Testnet

1. **Create `.env.local` file** (if you don't have one):
   ```bash
   cp .env.example .env.local
   ```

2. **Add your private key to `.env.local`:**
   ```bash
   PRIVATE_KEY=your_private_key_here
   ```

3. **Deploy:**
   ```bash
   pnpm deploy:testnet
   ```

That's it! The script will:
- ✅ Deploy the contract
- ✅ Show you the contract address
- ✅ Automatically update `.env.local` with the contract address
- ✅ Show you the BSCScan explorer link

## What You Need After Deployment

1. **WalletConnect Project ID** (for frontend):
   - Go to https://cloud.walletconnect.com
   - Create a project
   - Copy the Project ID
   - Add to `.env.local`: `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_id`

2. **Contract Address** (automatically added by deploy script)

## Run the Frontend

```bash
pnpm dev
```

Visit http://localhost:3000

## Deploy to Mainnet

⚠️ **Only after thorough testing on testnet!**

```bash
pnpm deploy:mainnet
```

Make sure you have real BNB in your wallet for gas fees.

## Troubleshooting

**"Insufficient balance"**
→ Get testnet BNB from the faucet

**"Invalid private key"**
→ Make sure your private key starts with `0x` and has no spaces

**"Network error"**
→ Check your internet connection and try again

