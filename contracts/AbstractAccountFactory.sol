// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./AbstractAccount.sol";

contract AbstractAccountFactory {
    event AccountCreated(address account, address owner);

    function getAddress(
        address owner,
        bytes32 salt
    ) public view returns (address) {
        bytes memory bytecode = getBytecode(owner);
        bytes32 hash = keccak256(
            abi.encodePacked(
                bytes1(0xff),
                address(this),
                salt,
                keccak256(bytecode)
            )
        );
        return address(uint160(uint(hash)));
    }

    function createAccount(
        address owner,
        bytes32 salt
    ) public returns (address) {
        address accountAddr = getAddress(owner, salt);
        if (isContract(accountAddr)) return accountAddr;

        bytes memory bytecode = getBytecode(owner);
        address newAccount;
        assembly {
            newAccount := create2(0, add(bytecode, 0x20), mload(bytecode), salt)
            if iszero(newAccount) {
                revert(0, 0)
            }
        }

        emit AccountCreated(newAccount, owner);
        return newAccount;
    }

    function getBytecode(address owner) public pure returns (bytes memory) {
        return
            abi.encodePacked(
                type(AbstractAccount).creationCode,
                abi.encode(owner)
            );
    }

    function isContract(address account) internal view returns (bool) {
        return account.code.length > 0;
    }
}
