// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseEther } from "viem";

//const ONE_GWEI: bigint = 1_000_000_000n;

const AbstractAccountModule = buildModule("AbstractAccountModule", (m) => {
 //const lockedAmount = m.getParameter("lockedAmount", ONE_GWEI);
  const ownerAddress = m.getParameter("ownerAddress", process.env.OWNER_ADDRESS);

  const AbstractAccount = m.contract("AbstractAccount", [ownerAddress], {
  });

  return { AbstractAccount };
});

export default AbstractAccountModule;
