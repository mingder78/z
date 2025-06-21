const { expect } = require("chai");
const { viem } = require("hardhat");
const { toHex, randomBytes } = require("viem");
require("dotenv").config();

describe("AbstractAccountFactory", function () {
  let publicClient;
  let walletClient;
  let owner;
  let factory;
  const FACTORY_ADDRESS = process.env.FACTORY_ADDRESS; // 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
  const ENTRY_POINT_ADDRESS = process.env.ENTRY_POINT_ADDRESS; // 0x5FbDB2315678afecb367f032d93F642f64180aa3

  // Minimal ABI for AbstractAccountFactory
  const factoryAbi = [
    {
      name: "createAccount",
      type: "function",
      inputs: [
        { name: "owner", type: "address" },
        { name: "salt", type: "uint256" },
      ],
      outputs: [{ name: "", type: "address" }],
      stateMutability: "nonpayable",
    },
    {
      name: "AccountCreated",
      type: "event",
      inputs: [
        { name: "account", type: "address", indexed: true },
        { name: "owner", type: "address", indexed: true },
        { name: "salt", type: "uint256", indexed: false },
      ],
    },
  ];

  const accountAbi = [
    {
      name: "owner",
      type: "function",
      inputs: [],
      outputs: [{ name: "", type: "address" }],
      stateMutability: "view",
    },
    {
      name: "entryPoint",
      type: "function",
      inputs: [],
      outputs: [{ name: "", type: "address" }],
      stateMutability: "view",
    },
  ];

  beforeEach(async function () {
    // Initialize Viem clients
    publicClient = await viem.getPublicClient();
    const accounts = await viem.getWalletClients();
    walletClient = accounts[0]; // Use the first Hardhat account
    owner = walletClient.account.address;

    // Attach to the deployed AbstractAccountFactory
    factory = await viem.getContractAt("AbstractAccountFactory", FACTORY_ADDRESS, { client: { wallet: walletClient } });
  });

  it("should create a new account via the factory", async function () {
    // Generate a random 32-byte salt and convert to uint256 (BigInt)
    const salt = BigInt(toHex(randomBytes(32)));

    // Call the createAccount function
    const hash = await factory.write.createAccount([owner, salt]);

    // Wait for the transaction receipt
    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    // Find the AccountCreated event
    const eventFilter = await publicClient.createEventFilter({
      address: FACTORY_ADDRESS,
      event: factoryAbi.find((item) => item.name === "AccountCreated"),
    });
    const logs = await publicClient.getFilterLogs({ filter: eventFilter });
    const event = logs.find((log) => log.address.toLowerCase() === FACTORY_ADDRESS.toLowerCase());

    expect(event, "AccountCreated event should be emitted").to.exist;

    // Decode the event to get the account address
    const decodedEvent = publicClient.parseEventLog({
      abi: factoryAbi,
      eventName: "AccountCreated",
      log: event,
    });
    expect(decodedEvent.args.account).to.be.a("string");
    expect(decodedEvent.args.account).to.match(/^0x[a-fA-F0-9]{40}$/);

    // Attach to the created account
    const accountContract = await viem.getContractAt("AbstractAccount", decodedEvent.args.account, { client: { public: publicClient } });

    // Verify the owner of the account
    const accountOwner = await accountContract.read.owner();
    expect(accountOwner).to.equal(owner);

    // Verify the entry point
    const entryPoint = await accountContract.read.entryPoint();
    expect(entryPoint).to.equal(ENTRY_POINT_ADDRESS);
  });
});
