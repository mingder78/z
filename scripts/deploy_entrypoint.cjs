const { ethers } = require("hardhat");

async function main() {
  // Get the contract factory
  const EntryPoint = await ethers.getContractFactory("EntryPoint");

  // Deploy the contract
  console.log("Deploying EntryPoint...");
  const entryPoint = await EntryPoint.deploy();

  // Wait for the deployment to complete
  await entryPoint.waitForDeployment();


  console.log("EntryPoint deployed to:", entryPoint.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
