// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const AbstractAccountFactoryModule = buildModule("AbstractAccountFactoryModule", (m) => {

  const AbstractAccountFactory = m.contract("AbstractAccountFactory", [], {
  });

  return { AbstractAccountFactory };
});

export default AbstractAccountFactoryModule;
