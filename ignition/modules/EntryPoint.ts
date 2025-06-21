// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseEther } from "viem";

const EntryPointModule = buildModule("EntryPointModule", (m) => {

  const EntryPoint = m.contract("EntryPoint", [], {
  });

  return { EntryPoint };
});

export default EntryPointModule;
