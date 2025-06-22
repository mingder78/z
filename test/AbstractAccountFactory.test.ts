import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { getAddress, toHex, randomBytes } from "viem";

describe("AbstractAccountFactory", function () {
  // Fixture to deploy EntryPoint and AbstractAccountFactory
 async function deployContractsFixture() {
    const publicClient = await hre.viem.getPublicClient();
    const [walletClient] = await hre.viem.getWalletClients();
    const owner = walletClient.account.address;

    // Read ABIs from artifacts
    let entryPointArtifact, factoryArtifact, accountArtifact;
    try {
      entryPointArtifact = await hre.artifacts.readArtifact("EntryPoint");
console.log('ming')
      factoryArtifact = await hre.artifacts.readArtifact("AbstractAccountFactory");
      accountArtifact = await hre.artifacts.readArtifact("AbstractAccount");
console.log(factoryArtifact)
      console.log("EntryPoint ABI constructor:", entryPointArtifact.abi.find((item) => item.type === "constructor"));
      console.log("AbstractAccountFactory ABI constructor:", factoryArtifact.abi.find((item) => item.type === "constructor"));
    } catch (error) {
      console.error("Error loading artifacts:", error.message);
      throw error;
    }

    // Deploy EntryPoint contract
    let entryPoint;
    try {
      entryPoint = await hre.viem.deployContract("EntryPoint", []);
      console.log("EntryPoint deployed at:", entryPoint.address);
    } catch (error) {
      console.error("EntryPoint deployment failed:", error.message);
      throw error;
    }

    // Deploy AbstractAccountFactory contract
    let factory;
    try {
      factory = await hre.viem.deployContract("AbstractAccountFactory", [entryPoint.address]);
      console.log("AbstractAccountFactory deployed at:", factory.address);
    } catch (error) {
      console.error("AbstractAccountFactory deployment failed:", error.message);
      throw error;
    }

    return {
      publicClient,
      walletClient,
      owner,
      entryPoint,
      factory,
      entryPointAbi: entryPointArtifact.abi,
      factoryAbi: factoryArtifact.abi,
      accountAbi: accountArtifact.abi,
    };
}

  it("should create a new account via the factory", async function () {
    const { publicClient, walletClient, owner, entryPoint, factory,  factoryAbi, accountAbi } = await loadFixture(deployContractsFixture);

    // Generate a random bytes32 salt
    const salt = toHex(randomBytes(32));
    return true;
  })

})
