// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/Create2.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/interfaces/IERC1271.sol";

// CustomSmartAccount contract
contract CustomSmartAccount is IERC1271 {
    address public owner;
    uint256 public nonce;

    event Executed(address indexed target, uint256 value, bytes data);

    constructor(address _owner) {
        owner = _owner;
    }

    function execute(address target, uint256 value, bytes calldata data) external {
        require(msg.sender == owner, "Only owner can execute");
        (bool success, ) = target.call{value: value}(data);
        require(success, "Execution failed");
        emit Executed(target, value, data);
        nonce++;
    }

    function isValidSignature(bytes32 hash, bytes memory signature) external view override returns (bytes4) {
        address signer = ECDSA.recover(hash, signature);
        return signer == owner ? this.isValidSignature.selector : bytes4(0);
    }

    receive() external payable {}
}

