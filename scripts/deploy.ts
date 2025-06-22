const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying with account:", deployer.address);

    // Deploy CustomSmartAccount
    const CustomSmartAccount = await ethers.getContractFactory("CustomSmartAccount");
    const account = await CustomSmartAccount.deploy(deployer.address); // Temporary deployment for creation code
    console.log("CustomSmartAccount deployed to:", account.address);

    // Deploy CustomSmartAccountFactory
    const CustomSmartAccountFactory = await ethers.getContractFactory("CustomSmartAccountFactory");
    const factory = await CustomSmartAccountFactory.deploy(account.address);
    console.log("CustomSmartAccountFactory deployed to:", factory.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});