// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.28;

/* solhint-disable avoid-low-level-calls */
/* solhint-disable no-inline-assembly */

import "./EntryPoint.sol";
import "./interfaces/IEntryPointSimulations.sol";

/*
 * This contract inherits the EntryPoint and extends it with the view-only methods that are executed by
 * the bundler in order to check UserOperation validity and estimate its gas consumption.
 * This contract should never be deployed on-chain and is only used as a parameter for the "eth_call" request.
 */
contract EntryPointSimulations is EntryPoint, IEntryPointSimulations {

    SenderCreator private _senderCreator;

    bytes32 private __domainSeparatorV4;

    function initSenderCreator() internal virtual {
        // This is the address of the first contract created with CREATE by this address.
        address createdObj = address(uint160(uint256(keccak256(abi.encodePacked(hex"d694", address(this), hex"01")))));
        _senderCreator = SenderCreator(createdObj);

        _initDomainSeparator();
    }

    function senderCreator() public view virtual override(EntryPoint, IEntryPoint) returns (ISenderCreator) {
        // return the same senderCreator as real EntryPoint.
        // this call is slightly (100) more expensive than EntryPoint's access to immutable member
        return _senderCreator;
    }

    /**
     * simulation contract should not be deployed, and specifically, accounts should not trust
     * it as entrypoint, since the simulation functions don't check the signatures
     */
    constructor() {
        require(block.number < 1000, "should not be deployed");
    }

    /// @inheritdoc IEntryPointSimulations
    function simulateValidation(
        PackedUserOperation calldata userOp
    )
    external
    returns (
        ValidationResult memory
    ){
        UserOpInfo memory outOpInfo;

        _simulationOnlyValidations(userOp);
        (
            uint256 validationData,
            uint256 paymasterValidationData
        ) = _validatePrepayment(0, userOp, outOpInfo);
        StakeInfo memory paymasterInfo = _getStakeInfo(
            outOpInfo.mUserOp.paymaster
        );
        StakeInfo memory senderInfo = _getStakeInfo(outOpInfo.mUserOp.sender);
        StakeInfo memory factoryInfo;
        {
            bytes calldata initCode = userOp.initCode;
            address factory = initCode.length >= 20
                ? address(bytes20(initCode[0 : 20]))
                : address(0);
            factoryInfo = _getStakeInfo(factory);
        }

        address aggregator = address(uint160(validationData));
        ReturnInfo memory returnInfo = ReturnInfo(
            outOpInfo.preOpGas,
            outOpInfo.prefund,
            validationData,
            paymasterValidationData,
            _getMemoryBytesFromOffset(outOpInfo.contextOffset)
        );

        AggregatorStakeInfo memory aggregatorInfo; // = NOT_AGGREGATED;
        if (uint160(aggregator) != SIG_VALIDATION_SUCCESS && uint160(aggregator) != SIG_VALIDATION_FAILED) {
            aggregatorInfo = AggregatorStakeInfo(
                aggregator,
                _getStakeInfo(aggregator)
            );
        }
        return ValidationResult(
            returnInfo,
            senderInfo,
            factoryInfo,
            paymasterInfo,
            aggregatorInfo
        );
    }

    /// @inheritdoc IEntryPointSimulations
    function simulateHandleOp(
        PackedUserOperation calldata op,
        address target,
        bytes calldata targetCallData
    )
    external nonReentrant
    returns (
        ExecutionResult memory
    ){
        UserOpInfo memory opInfo;
        _simulationOnlyValidations(op);
        (
            uint256 validationData,
            uint256 paymasterValidationData
        ) = _validatePrepayment(0, op, opInfo);

        uint256 paid = _executeUserOp(0, op, opInfo);
        bool targetSuccess;
        bytes memory targetResult;
        if (target != address(0)) {
            (targetSuccess, targetResult) = target.call(targetCallData);
        }
        return ExecutionResult(
            opInfo.preOpGas,
            paid,
            validationData,
            paymasterValidationData,
            targetSuccess,
            targetResult
        );
    }

    function _simulationOnlyValidations(
        PackedUserOperation calldata userOp
    )
    internal
    {
        // Initialize senderCreator(). we can't rely on constructor
        initSenderCreator();

        try
        this.validateSenderAndPaymaster(
            userOp.initCode,
            userOp.sender,
            userOp.paymasterAndData
        )
        // solhint-disable-next-line no-empty-blocks
        {} catch Error(string memory revertReason) {
            if (bytes(revertReason).length != 0) {
                revert FailedOp(0, revertReason);
            }
        }
    }

    /**
     * Called only during simulation by the EntryPointSimulation contract itself and is not meant to be called by external contracts.
     * This function always reverts to prevent warm/cold storage differentiation in simulation vs execution.
     * @param initCode         - The smart account constructor code.
     * @param sender           - The sender address.
     * @param paymasterAndData - The paymaster address (followed by other params, ignored by this method)
     */
    function validateSenderAndPaymaster(
        bytes calldata initCode,
        address sender,
        bytes calldata paymasterAndData
    ) external view {
        if (initCode.length == 0 && sender.code.length == 0) {
            // it would revert anyway. but give a meaningful message
            revert("AA20 account not deployed");
        }
        if (paymasterAndData.length >= 20) {
            address paymaster = address(bytes20(paymasterAndData[0 : 20]));
            if (paymaster.code.length == 0) {
                // It would revert anyway. but give a meaningful message.
                revert("AA30 paymaster not deployed");
            }
        }
        // always revert
        revert("");
    }

    // Make sure depositTo cost is more than normal EntryPoint's cost,
    // to mitigate DoS vector on the bundler
    // empiric test showed that without this wrapper, simulation depositTo costs less..
    function depositTo(address account) public override(IStakeManager, StakeManager) payable {
        unchecked{
        // silly code, to waste some gas to make sure depositTo is always little more
        // expensive than on-chain call
            uint256 x = 1;
            while (x < 5) {
                x++;
            }
            StakeManager.depositTo(account);
        }
    }

    // Copied from EIP712.sol
    bytes32 private constant TYPE_HASH =
    keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)");

    function __buildDomainSeparator() private view returns (bytes32) {
        bytes32 _hashedName = keccak256(bytes(DOMAIN_NAME));
        bytes32 _hashedVersion = keccak256(bytes(DOMAIN_VERSION));
        return keccak256(abi.encode(TYPE_HASH, _hashedName, _hashedVersion, block.chainid, address(this)));
    }

    // Can't rely on "immutable" (constructor-initialized) variables" in simulation
    function _initDomainSeparator() internal {
        __domainSeparatorV4 = __buildDomainSeparator();
    }

    function getDomainSeparatorV4() public override view returns (bytes32) {
        return __domainSeparatorV4;
    }

    function supportsInterface(bytes4) public view virtual override returns (bool) {
        return false;
    }
}
