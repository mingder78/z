// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/Create2.sol";
import "./CustomSmartAccount.sol"; // Import the CustomSmartAccount contract

contract CustomSmartAccountFactory {
    address public immutable accountImplementation;

    constructor(address _accountImplementation) {
        accountImplementation = _accountImplementation;
    }

    function createAccount(address owner, bytes32 salt) external returns (address) {
        address accountAddress = getAccountAddress(owner, salt);

        if (accountAddress.code.length == 0) {
            address deployed = Create2.deploy(
                0,
                salt,
                abi.encodePacked(
                    type(CustomSmartAccount).creationCode, // Now accessible via import
                    abi.encode(owner)
                )
            );
            require(deployed == accountAddress, "Deployment address mismatch");
        }

        return accountAddress;
    }

    function getAccountAddress(address owner, bytes32 salt) public view returns (address) {
        return Create2.computeAddress(
            salt,
            keccak256(
                abi.encodePacked(
                    type(CustomSmartAccount).creationCode, // Now accessible via import
                    abi.encode(owner)
                )
            )
        );
    }
}