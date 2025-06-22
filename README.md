# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.ts
```

## run 

after you deploy then in localhost, you should update the following FACORY_ADDRESS and ENTRY_POINT_ADDRESS in your .env file

```
OWNER_ADDRESS=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
FACTORY_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
ENTRY_POINT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

```
bun i
bun compile
bun dev
bun dev:aa
bun dev:aaf
```

start a local node

```
npx hardhat node
```

## deployment and verification

manually deploy all contracts on localhost (you can try to deploy on hardhat or other networks)

```
npx hardhat ignition deploy ./ignition/modules/AbstractAccountFactory.ts --network localhost

Hardhat Ignition 🚀

Resuming existing deployment from ./ignition/deployments/chain-31337

Deploying [ AbstractAccountFactoryModule ]

Warning - previously executed futures are not in the module:
 - EntryPointModule#EntryPoint
 - AbstractAccountModule#AbstractAccount

Batch #1
  Executed AbstractAccountFactoryModule#AbstractAccountFactory

[ AbstractAccountFactoryModule ] successfully deployed 🚀

Deployed Addresses

EntryPointModule#EntryPoint - 0x5FbDB2315678afecb367f032d93F642f64180aa3
AbstractAccountModule#AbstractAccount - 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
AbstractAccountFactoryModule#AbstractAccountFactory - 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
```

### use tenderly

on sepolia testnet

```
TENDERLY_AUTOMATIC_VERIFICATION=true bun dev:aaf --network sepolia --deployment-id sepolia-ming
$ bun x hardhat ignition deploy ./ignition/modules/AbstractAccountFactory.ts  --network sepolia --deployment-id sepolia-ming
2025-06-22 02:06:09.771 WARN Service =>Tenderly config doesn't exist, empty string values are returned instead.
✔ Confirm deploy to network sepolia (11155111)? … yes
[ AbstractAccountFactoryModule ] Nothing new to deploy based on previous execution stored in ./ignition/deployments/sepolia-ming

Deployed Addresses

EntryPointModule#EntryPoint - 0x64e4476B8a75E66FA31c198b702a3C6784CEf29e
AbstractAccountModule#AbstractAccount - 0xdC1a6BBD3ba8099fa9880e96ebCa55F8066A874f
AbstractAccountFactoryModule#AbstractAccountFactory - 0xc4D2CADcCeeABFf3F3D4E39B4E0f9A9E050eDb04
```

## Todo


```
$ bun x hardhat compile
Warning: Transient storage as defined by EIP-1153 can break the composability of smart contracts: Since transient storage is cleared only at the end of the transaction and not at the end of the outermost call frame to the contract within a transaction, your contract may unintentionally misbehave when invoked multiple times in a complex transaction. To avoid this, be sure to clear all transient storage at the end of any call to your contract. The use of transient storage for reentrancy guards that are cleared at the end of the call is safe.
   --> @openzeppelin/contracts/utils/TransientSlot.sol:108:13:
    |
108 |             tstore(slot, value)
    |             ^^^^^^
```
