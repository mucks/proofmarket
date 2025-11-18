const { createWalletClient, createPublicClient, http, parseEther, formatEther, getAddress, decodeEventLog } = require('viem');
const { privateKeyToAccount } = require('viem/accounts');
const { bscTestnet } = require('viem/chains');
const { readFileSync, existsSync } = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

// Contract ABI and address - read from compiled artifact
const artifactPath = path.join(__dirname, '..', 'artifacts', 'contracts', 'MilestonePrediction.sol', 'MilestonePrediction.json');
if (!existsSync(artifactPath)) {
  throw new Error(
    `Contract artifact not found at ${artifactPath}.\n` +
    'Please compile the contract first: pnpm run compile'
  );
}
const contractArtifact = JSON.parse(readFileSync(artifactPath, 'utf-8'));
const MILESTONE_PREDICTION_ABI = contractArtifact.abi;

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

if (!CONTRACT_ADDRESS) {
  throw new Error('NEXT_PUBLIC_CONTRACT_ADDRESS not found in .env.local');
}

// Mock data
const FEATURED_STARTUPS = [
  { name: 'Tesla', description: 'Electric vehicle and clean energy company revolutionizing transportation and energy storage.', category: 'AI', stage: 'Public', website: 'https://tesla.com' },
  { name: 'OpenAI', description: 'AI research and deployment company creating safe artificial general intelligence.', category: 'AI/ML', stage: 'Private', website: 'https://openai.com' },
  { name: 'Apple', description: 'Technology company designing and manufacturing consumer electronics, software, and online services.', category: 'Gaming', stage: 'Public', website: 'https://apple.com' },
  { name: 'Ethereum', description: 'Decentralized blockchain platform enabling smart contracts and decentralized applications.', category: 'DeFi', stage: 'Public', website: 'https://ethereum.org' },
  { name: 'SpaceX', description: 'Aerospace manufacturer and space transportation company working towards Mars colonization.', category: 'Infrastructure', stage: 'Private', website: 'https://spacex.com' },
];

// Generate future deadlines relative to current date
const now = new Date();
const oneYearFromNow = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
const twoYearsFromNow = new Date(now.getTime() + 2 * 365 * 24 * 60 * 60 * 1000);
const sixMonthsFromNow = new Date(now.getTime() + 6 * 30 * 24 * 60 * 60 * 1000);
const threeMonthsFromNow = new Date(now.getTime() + 3 * 30 * 24 * 60 * 60 * 1000);
const fiveYearsFromNow = new Date(now.getTime() + 5 * 365 * 24 * 60 * 60 * 1000);

const FEATURED_MARKETS = [
  { title: 'Will Tesla deliver Robotaxi in 2026?', description: 'Tesla has promised fully autonomous robotaxis by 2026. Will they achieve Level 5 autonomy and launch a commercial robotaxi service?', deadline: twoYearsFromNow, creatorStake: '0.01', startupName: 'Tesla' },
  { title: 'Will OpenAI launch GPT-6 by Q2 2025?', description: 'OpenAI has been rapidly iterating on GPT models. Will GPT-6 be released to the public by the end of Q2 2025?', deadline: sixMonthsFromNow, creatorStake: '0.01', startupName: 'OpenAI' },
  { title: 'Will Apple release AR glasses by 2025?', description: 'Apple has been working on AR/VR technology. Will they release consumer AR glasses by the end of 2025?', deadline: oneYearFromNow, creatorStake: '0.01', startupName: 'Apple' },
  { title: 'Will Ethereum reach $10,000 by end of 2025?', description: 'Ethereum has been gaining adoption. Will the price reach $10,000 USD by December 31, 2025?', deadline: oneYearFromNow, creatorStake: '0.01', startupName: 'Ethereum' },
  { title: 'Will SpaceX land humans on Mars by 2030?', description: 'SpaceX has ambitious plans for Mars colonization. Will they successfully land humans on Mars by 2030?', deadline: fiveYearsFromNow, creatorStake: '0.01', startupName: 'SpaceX' },
];

async function main() {
  console.log('🚀 Starting Testnet Seed Script\n');
  console.log('📋 Contract Address:', CONTRACT_ADDRESS);
  console.log('🌐 Network: BSC Testnet (Chain ID: 97)\n');

  const fs = require('fs');
  const walletsPath = path.join(__dirname, '..', 'testnet-wallets.json');
  
  // Check if wallets file exists and load existing wallets
  let wallets = [];
  let privateKeys = [];
  let walletsData;

  if (existsSync(walletsPath)) {
    console.log('📂 Loading existing wallets from testnet-wallets.json...\n');
    const existingData = JSON.parse(readFileSync(walletsPath, 'utf-8'));
    
    // Verify contract address matches (warn if different)
    if (existingData.contractAddress && existingData.contractAddress !== CONTRACT_ADDRESS) {
      console.log(`⚠️  Warning: Stored contract address (${existingData.contractAddress}) differs from current (${CONTRACT_ADDRESS})`);
      console.log(`   Using current contract address: ${CONTRACT_ADDRESS}\n`);
    }
    
    wallets = existingData.wallets.map(w => privateKeyToAccount(w.privateKey));
    privateKeys = existingData.wallets.map(w => w.privateKey);
    walletsData = existingData;
    
    console.log(`✅ Loaded ${wallets.length} existing wallets:\n`);
    wallets.forEach((w, i) => {
      console.log(`Wallet ${i + 1}:`);
      console.log(`  Address: ${w.address}`);
      console.log(`  Private Key: ${privateKeys[i].slice(0, 10)}...${privateKeys[i].slice(-8)}\n`);
    });
    console.log(`💡 Reusing Wallet 1 (${wallets[0].address}) - you can fund this if needed\n`);
  } else {
    // Create new wallets
    console.log('👛 Creating 6 new wallets...\n');
    
    for (let i = 0; i < 6; i++) {
      // Generate a random private key
      const privateKey = `0x${Array.from({ length: 64 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('')}`;
      
      const account = privateKeyToAccount(privateKey);
      wallets.push(account);
      privateKeys.push(privateKey);
      
      console.log(`Wallet ${i + 1}:`);
      console.log(`  Address: ${account.address}`);
      console.log(`  Private Key: ${privateKey}\n`);
    }

    // Save wallets to a file for reference
    walletsData = {
      wallets: wallets.map((w, i) => ({
        index: i + 1,
        address: w.address,
        privateKey: privateKeys[i],
      })),
      contractAddress: CONTRACT_ADDRESS,
      network: 'BSC Testnet',
    };

    fs.writeFileSync(walletsPath, JSON.stringify(walletsData, null, 2));
    console.log(`💾 Wallets saved to: ${walletsPath}\n`);
  }

  // Ensure we have 6 wallets
  if (wallets.length !== 6) {
    throw new Error(`Expected 6 wallets but found ${wallets.length}. Please delete testnet-wallets.json and run again.`);
  }

  // Calculate required BNB for distribution to other wallets
  // Each wallet needs a small amount for potential future use (0.01 BNB each)
  const amountPerWallet = parseEther('0.01');
  const distributionGasEstimate = parseEther('0.01'); // Estimate for 5 distribution transactions
  const totalForDistribution = amountPerWallet * BigInt(5) + distributionGasEstimate;
  
  // We'll use the remaining balance in Wallet 1 to create markets
  // So we only need enough for distribution
  const totalNeededInWallet1 = totalForDistribution;

  // Main wallet (wallet 1) - user will fund this manually
  const mainWallet = wallets[0];
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('⚠️  ACTION REQUIRED: Fund Wallet 1 with BNB');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`📍 Wallet 1 Address: ${mainWallet.address}`);
  console.log(`💰 Minimum required: ${formatEther(totalNeededInWallet1)} BNB (for wallet distribution)`);
  console.log(`   - Distribution to 5 wallets: ${formatEther(amountPerWallet * BigInt(5))} BNB`);
  console.log(`   - Distribution gas: ${formatEther(distributionGasEstimate)} BNB`);
  console.log(`💡 Remaining balance will be used to create markets`);
  console.log(`   (Each market needs ~0.015 BNB: 0.01 stake + 0.005 gas)`);
  console.log(`🔗 BSCScan: https://testnet.bscscan.com/address/${mainWallet.address}`);
  console.log(`💡 Recommended: Fund with 0.2 BNB to create ~10 markets`);
  console.log('═══════════════════════════════════════════════════════════════\n');

  // Wait for user confirmation
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  await new Promise((resolve) => {
    rl.question(`✅ Have you funded wallet 1 with at least ${formatEther(totalNeededInWallet1)} BNB? (yes/no): `, async (answer) => {
      rl.close();
      if (answer.toLowerCase() !== 'yes') {
        console.log(`❌ Please fund wallet 1 with at least ${formatEther(totalNeededInWallet1)} BNB first, then run the script again.`);
        process.exit(1);
      }
      resolve();
    });
  });

  // Create public and wallet clients
  const publicClient = createPublicClient({
    chain: bscTestnet,
    transport: http(),
  });

  const mainWalletClient = createWalletClient({
    account: mainWallet,
    chain: bscTestnet,
    transport: http(),
  });

  // Check main wallet balance
  const mainBalance = await publicClient.getBalance({ address: mainWallet.address });
  console.log(`\n💰 Main wallet balance: ${formatEther(mainBalance)} BNB`);
  console.log(`   Required: ${formatEther(totalNeededInWallet1)} BNB\n`);

  if (mainBalance < totalNeededInWallet1) {
    throw new Error(
      `Insufficient balance in main wallet.\n` +
      `  Current: ${formatEther(mainBalance)} BNB\n` +
      `  Required: ${formatEther(totalNeededInWallet1)} BNB\n` +
      `  Please fund wallet 1 with at least ${formatEther(totalNeededInWallet1)} BNB.`
    );
  }

  // Distribute small amount to other wallets (for potential future use)
  console.log('💸 Distributing BNB to other wallets...\n');

  for (let i = 1; i < 6; i++) {
    const targetWallet = wallets[i];
    try {
      console.log(`  Sending ${formatEther(amountPerWallet)} BNB to Wallet ${i + 1} (${targetWallet.address})...`);
      
      const hash = await mainWalletClient.sendTransaction({
        to: targetWallet.address,
        value: amountPerWallet,
      });

      // Wait for transaction
      await publicClient.waitForTransactionReceipt({ hash });
      console.log(`  ✅ Transaction confirmed: ${hash}\n`);
    } catch (error) {
      console.error(`  ❌ Failed to send to wallet ${i + 1}:`, error.message);
      throw error;
    }
  }

  console.log('✅ BNB distribution complete!\n');

  // Check remaining balance in main wallet
  const remainingBalance = await publicClient.getBalance({ address: mainWallet.address });
  console.log(`💰 Remaining balance in Wallet 1: ${formatEther(remainingBalance)} BNB\n`);

  // Calculate how many markets we can create with remaining balance
  // Each market needs: creator stake (0.01 BNB) + gas (~0.005 BNB) = ~0.015 BNB
  const costPerMarket = parseEther('0.015');
  const maxMarkets = Math.floor(Number(remainingBalance) / Number(costPerMarket));
  const marketsToCreate = Math.min(maxMarkets, FEATURED_MARKETS.length);

  if (marketsToCreate === 0) {
    console.log('⚠️  Insufficient balance to create markets. Need at least 0.015 BNB per market.');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('✅ Seed script completed (no markets created)');
    console.log('═══════════════════════════════════════════════════════════════\n');
    return;
  }

  console.log(`📊 Creating ${marketsToCreate} markets with remaining balance...\n`);

  let marketsCreated = 0;

  for (let i = 0; i < marketsToCreate; i++) {
    const market = FEATURED_MARKETS[i];
    const walletClient = mainWalletClient; // Use main wallet for all markets

    // Find category from FEATURED_STARTUPS
    const startupInfo = FEATURED_STARTUPS.find(s => s.name === market.startupName);
    const category = startupInfo?.category || 'AI';

    const metadata = JSON.stringify({
      title: market.title,
      description: market.description,
      startupName: market.startupName,
      category: category,
    });

    const deadline = BigInt(Math.floor(market.deadline.getTime() / 1000));
    const creatorStake = parseEther(market.creatorStake);

    // Check if we have enough balance
    const currentBalance = await publicClient.getBalance({ address: mainWallet.address });
    if (currentBalance < creatorStake + parseEther('0.005')) {
      console.log(`  ⚠️  Insufficient balance to create more markets. Stopping at ${marketsCreated} markets.\n`);
      break;
    }

    try {
      console.log(`  Creating market ${i + 1}/${marketsToCreate}: ${market.title}...`);
      console.log(`     Stake: ${market.creatorStake} BNB, Startup: ${market.startupName || 'None'}`);
      
      const hash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: MILESTONE_PREDICTION_ABI,
        functionName: 'createMarket',
        args: [deadline, metadata, BigInt(0)], // startupId = 0 (no startup)
        value: creatorStake,
      });

      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      
      // Extract market ID from event
      const marketCreatedEvent = receipt.logs.find(log => {
        try {
          const decoded = decodeEventLog({
            abi: MILESTONE_PREDICTION_ABI,
            data: log.data,
            topics: log.topics,
          });
          return decoded.eventName === 'MarketCreated';
        } catch {
          return false;
        }
      });

      if (marketCreatedEvent) {
        const decoded = decodeEventLog({
          abi: MILESTONE_PREDICTION_ABI,
          data: marketCreatedEvent.data,
          topics: marketCreatedEvent.topics,
        });
        const marketId = Number(decoded.args.marketId);
        marketsCreated++;
        console.log(`  ✅ Market created with ID: ${marketId}`);
        console.log(`     Transaction: ${hash}\n`);
      } else {
        console.log(`  ⚠️  Market created but couldn't extract ID`);
        console.log(`     Transaction: ${hash}\n`);
      }
    } catch (error) {
      console.error(`  ❌ Failed to create market "${market.title}":`, error.message);
      // Continue with next market instead of throwing
      console.log(`     Continuing with next market...\n`);
    }
  }

  const finalBalance = await publicClient.getBalance({ address: mainWallet.address });
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('✅ Seed script completed successfully!');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`📊 Created ${marketsCreated} markets`);
  console.log(`💰 Remaining balance: ${formatEther(finalBalance)} BNB`);
  console.log(`💾 Wallet details saved to: ${walletsPath}`);
  console.log('═══════════════════════════════════════════════════════════════\n');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n❌ Script failed:');
    console.error(error);
    process.exit(1);
  });

