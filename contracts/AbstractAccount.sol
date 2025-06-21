// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IEntryPoint {
    function handleOps(UserOperation[] calldata ops, address beneficiary) external;
}

struct UserOperation {
    address sender;
    uint256 nonce;
    bytes initCode;
    bytes callData;
    uint256 callGasLimit;
    uint256 verificationGasLimit;
    uint256 preVerificationGas;
    uint256 maxFeePerGas;
    uint256 maxPriorityFeePerGas;
    bytes paymasterAndData;
    bytes signature;
}

contract AbstractAccount {
    address public owner;

    constructor(address _owner) {
        owner = _owner;
    }

    function validateUserOp(UserOperation calldata userOp, bytes32 userOpHash, uint256)
        external
        view
        returns (uint256 validationData)
    {
        // Simplified: require a valid EOA signature (not secure in production)
        require(owner == recover(userOpHash, userOp.signature), "Invalid signature");
        return 0;
    }

    function execute(address to, uint256 value, bytes calldata data) external {
        require(msg.sender == owner, "Not owner");
        (bool success,) = to.call{value: value}(data);
        require(success, "Execution failed");
    }

    function recover(bytes32 hash, bytes memory signature) public pure returns (address) {
        (bytes32 r, bytes32 s, uint8 v) = abi.decode(signature, (bytes32, bytes32, uint8));
        return ecrecover(hash, v, r, s);
    }

    receive() external payable {}
}

