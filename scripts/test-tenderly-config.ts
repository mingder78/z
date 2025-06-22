// scripts/test-tenderly-config.ts
import hre from "hardhat";

async function main() {
  console.log("Tenderly Config:", hre.config.tenderly);
  console.log("TENDERLY_ACCESS_TOKEN:", process.env.TENDERLY_ACCESS_TOKEN);
  console.log("TENDERLY_AUTOMATIC_VERIFICATION:", process.env.TENDERLY_AUTOMATIC_VERIFICATION);

  try {
    await hre.tenderly.verify({
      name: "EntryPoint",
      address: "0x64e4476B8a75E66FA31c198b702a3C6784CEf29e",
      network: "sepolia",
    });
    console.log("Tenderly verification successful!");
  } catch (error) {
    console.error("Tenderly verification failed:", error);
  }
}

main().catch(console.error);
