import { createPublicClient, http } from "viem";
import { hardhat } from "viem/chains";
import { getContract } from "viem";

async function main() {
  // Ensure Hardhat's ethers is properly initialized
  const signers = await ethers.getSigners();
  if (!signers || signers.length === 0) {
    throw new Error("No signers available. Ensure Hardhat node is running and network is configured.");
  }
  const [deployer] = signers;
  console.log("Deploying contracts with account:", deployer.address);

  // Initialize Viem public client for Hardhat network
  const client = createPublicClient({
    chain: hardhat,
    transport: http(),
  });

  // Deploy EntryPoint contract using Hardhat
  const entryPointFactory = await ethers.getContractFactory("EntryPoint");
  const entryPoint = await entryPointFactory.deploy();
  await entryPoint.waitForDeployment(); // Use waitForDeployment for ethers v6
  const entryPointAddress = await entryPoint.getAddress();
  console.log("EntryPoint deployed to:", entryPointAddress);

  // Load the ABI from Hardhat artifacts
  const entryPointArtifact = await ethers.getContractFactory("EntryPoint");
  const entryPointAbi = entryPointArtifact.interface;
  console.log(entryPointAbi)
  // Verify deployment with Viem
  const entryPointContract = getContract({
    address: entryPointAddress as `0x${string}`,
    abi: entryPointAbi,
    client: client,
  });

  // Check the contract's version
  const version = await entryPointContract.read.VERSION();
  console.log("EntryPoint VERSION:", version);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
