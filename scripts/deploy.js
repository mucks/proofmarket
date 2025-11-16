const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Deploying MilestonePrediction contract...\n");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);
  
  // Check balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "BNB\n");

  if (balance === 0n) {
    throw new Error("❌ Insufficient balance. Please fund your account with testnet BNB.");
  }

  // Deploy the contract
  console.log("📦 Deploying contract...");
  const MilestonePrediction = await hre.ethers.getContractFactory("MilestonePrediction");
  const contract = await MilestonePrediction.deploy();
  
  await contract.waitForDeployment();
  const address = await contract.getAddress();
  
  console.log("\n✅ Contract deployed successfully!");
  console.log("📍 Contract address:", address);
  console.log("🔮 Oracle (deployer):", deployer.address);
  
  // Get network info
  const network = await hre.ethers.provider.getNetwork();
  const explorerUrl = network.chainId === 97n 
    ? `https://testnet.bscscan.com/address/${address}`
    : network.chainId === 56n
    ? `https://bscscan.com/address/${address}`
    : "";
  
  if (explorerUrl) {
    console.log("🔍 View on explorer:", explorerUrl);
  }

  // Update .env.local if it exists
  const envPath = path.join(__dirname, "..", ".env.local");
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, "utf-8");
    
    // Update or add contract address
    if (envContent.includes("NEXT_PUBLIC_CONTRACT_ADDRESS")) {
      envContent = envContent.replace(
        /NEXT_PUBLIC_CONTRACT_ADDRESS=.*/,
        `NEXT_PUBLIC_CONTRACT_ADDRESS=${address}`
      );
    } else {
      envContent += `\nNEXT_PUBLIC_CONTRACT_ADDRESS=${address}\n`;
    }
    
    fs.writeFileSync(envPath, envContent);
    console.log("\n✅ Updated .env.local with contract address");
  } else {
    console.log("\n⚠️  .env.local not found. Please add manually:");
    console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${address}`);
  }

  console.log("\n🎉 Deployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });

