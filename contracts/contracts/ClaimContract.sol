pragma solidity >=0.8.1 <0.9.0;

contract ClaimContract {
    enum AddressType {LegacyUncompressed, LegacyCompressed, SegwitUncompressed, SegwitCompressed}

    event Claim(bytes20 indexed _from, address _to, uint256 amount, uint256 _nominator, uint256 _denominator);

    bytes16 internal constant HEX_DIGITS = "0123456789abcdef";

    /* Constants for preparing the claim message text */
    uint8 internal constant ETH_ADDRESS_BYTE_LEN = 20;
    uint8 internal constant ETH_ADDRESS_HEX_LEN = ETH_ADDRESS_BYTE_LEN * 2;
    uint8 internal constant CLAIM_PARAM_HASH_BYTE_LEN = 12;
    uint8 internal constant CLAIM_PARAM_HASH_HEX_LEN = CLAIM_PARAM_HASH_BYTE_LEN * 2;

    uint8 internal constant BITCOIN_SIG_PREFIX_LEN = 24;
    bytes24 internal constant BITCOIN_SIG_PREFIX_STR = "Bitcoin Signed Message:\n";

    uint8 internal constant DIAMOND_SIG_PREFIX_LEN = 24;
    bytes24 internal constant DIAMOND_SIG_PREFIX_STR = "Diamond Signed Message:\n";

    uint256 public constant YEAR_IN_SECONDS = 31536000;
    uint256 public constant LEAP_YEAR_IN_SECONDS = 31622400;
    uint256 public constant DAY_IN_SECONDS = 86400;

    mapping(bytes20 => uint256) public balances;

    /* solhint-disable var-name-mixedcase */

    // tracks if dilution for 75% was executed
    bool public dilution_s1_75_executed;

    // tracks if dilution for 50% was executed
    bool public dilution_s2_50_executed;

    // tracks if dilution for 0% was executed
    bool public dilution_s3_0_executed;

    /* solhint-enable var-name-mixedcase */

    uint256 public deploymentTimestamp;

    address payable public lateClaimBeneficorAddressReinsertPot;

    address payable public lateClaimBeneficorAddressDAO;

    /// @dev the prefix for the signing message.
    /// A Prefix for the signing message can be used to separate different message between different contracts/networks
    /// e.g.: "claim to testnet" for indicating that this is only a testnet message.
    /// using another prefix makes old signatures invalid.
    bytes public prefixStr;

    constructor(
        address payable _lateClaimBeneficorAddressReinsertPot,
        address payable _lateClaimBeneficorAddressDAO,
        bytes memory _prefixStr
    ) public {
        deploymentTimestamp = block.timestamp;
        lateClaimBeneficorAddressReinsertPot = _lateClaimBeneficorAddressReinsertPot;
        lateClaimBeneficorAddressDAO = _lateClaimBeneficorAddressDAO;
        prefixStr = _prefixStr;
    }

    function _sendDilutedAmounts(uint256 amount) internal {
        //diluted amounts are split 50/50 to DAO and ReinsertPot.
        uint256 transferForResinsertPot = amount / 2;
        uint256 transferForDAO = amount - transferForResinsertPot;

        (bool success, ) = lateClaimBeneficorAddressReinsertPot.call{value: transferForResinsertPot}("");
        require(success, "Transfer to reinsert pool failed.");
        (success, ) = lateClaimBeneficorAddressDAO.call{value: transferForDAO}("");
        require(success, "Transfer to DAO failed.");
    }

    function getPublicKeyFromBitcoinSignature(
        bytes32 hashValue,
        bytes32 r,
        bytes32 s,
        uint8 v
    ) public pure returns (address) {
        require(v >= 4, "Bitcoin adds a constant 4 to the v value. this signature seems to be invalid.");
        //#1: decode bitcoin signature.
        //# get R, S, V and Hash of Signature.
        //# do ecrecover on it.
        //return "todo: implement this magic!";

        return
            ecrecover(
                hashValue,
                v - 4, //bitcoin signature use v that is +4 see reddit comment
                //https://www.reddit.com/r/ethereum/comments/3gmbkx/how_do_i_verify_a_bitcoinsigned_message_in_an/ctzopoz
                r,
                s
            );
    }

    /// @dev returns the essential part of a Bitcoin-style address associated with an ECDSA public key
    /// @param _publicKeyX X coordinate of the ECDSA public key
    /// @param _publicKeyY Y coordinate of the ECDSA public key
    /// @param _addressType Whether DMD is Legacy or Segwit address and if it was compressed
    /// @return Raw parts of the Bitcoin Style address
    function publicKeyToBitcoinAddress(
        bytes32 _publicKeyX,
        bytes32 _publicKeyY,
        AddressType _addressType
    ) public pure returns (bytes20) {
        bytes20 publicKey;
        uint8 initialByte;
        if (_addressType == AddressType.LegacyCompressed || _addressType == AddressType.SegwitCompressed) {
            //Hash the compressed format
            initialByte = (uint256(_publicKeyY) & 1) == 0 ? 0x02 : 0x03;
            publicKey = ripemd160(abi.encodePacked(sha256(abi.encodePacked(initialByte, _publicKeyX))));
        } else {
            //Hash the uncompressed format
            initialByte = 0x04;
            publicKey = ripemd160(abi.encodePacked(sha256(abi.encodePacked(initialByte, _publicKeyX, _publicKeyY))));
        }

        if (_addressType == AddressType.LegacyUncompressed || _addressType == AddressType.LegacyCompressed) {
            return publicKey;
        } else if (_addressType == AddressType.SegwitUncompressed || _addressType == AddressType.SegwitCompressed) {
            return ripemd160(abi.encodePacked(sha256(abi.encodePacked(hex"0014", publicKey))));
        }
    }

    /// @dev Convert an uncompressed ECDSA public key into an Ethereum address
    /// @param _publicKeyX X parameter of uncompressed ECDSA public key
    /// @param _publicKeyY Y parameter of uncompressed ECDSA public key
    /// @return Ethereum address generated from the ECDSA public key
    function publicKeyToEthereumAddress(bytes32 _publicKeyX, bytes32 _publicKeyY) public pure returns (address) {
        bytes32 hash = keccak256(abi.encodePacked(_publicKeyX, _publicKeyY));
        return address(uint160(uint256((hash))));
    }

    /**
     * @dev PUBLIC FACING: Derive an Ethereum address from an ECDSA public key
     * @param pubKeyX First  half of uncompressed ECDSA public key
     * @param pubKeyY Second half of uncompressed ECDSA public key
     * @return Derived Eth address
     */
    function pubKeyToEthAddress(bytes32 pubKeyX, bytes32 pubKeyY) public pure returns (address) {
        return address(uint160(uint256(keccak256(abi.encodePacked(pubKeyX, pubKeyY)))));
    }

    /**
     * @dev sha256(sha256(data))
     * @param data Data to be hashed
     * @return 32-byte hash
     */
    function calcHash256(bytes memory data) public pure returns (bytes32) {
        // NOTE: https://github.com/axic/ethereum-bsm/blob/master/bsm.sol
        // maybe encodePacked is not required ?!
        return sha256(abi.encodePacked(sha256(data)));
    }

    function _hexStringFromData(
        bytes memory hexStr,
        bytes32 data,
        uint256 startOffset,
        uint256 dataLen
    ) private pure {
        uint256 offset = startOffset;

        for (uint256 i = 0; i < dataLen; i++) {
            uint8 b = uint8(data[i]);

            hexStr[offset++] = HEX_DIGITS[b >> 4];
            hexStr[offset++] = HEX_DIGITS[b & 0x0f];
        }
    }

    function _addressStringChecksumChar(
        bytes memory addrStr,
        uint256 offset,
        uint8 hashNybble
    ) private pure {
        bytes1 ch = addrStr[offset];

        if (ch >= "a" && hashNybble >= 8) {
            addrStr[offset] = ch ^ 0x20;
        }
    }

    /**
     * @dev calculates the address string representation of the signed address.
     * @param _addr address
     * @param _includeAddrChecksum bool. should the addressChecksum be used for this caluclation.
     * @return addrStr ethereum address(24 byte)
     */
    function calculateAddressString(address _addr, bool _includeAddrChecksum)
        public
        pure
        returns (bytes memory addrStr)
    {
        bytes memory tmp = new bytes(ETH_ADDRESS_HEX_LEN);
        _hexStringFromData(tmp, bytes32(bytes20(_addr)), 0, ETH_ADDRESS_BYTE_LEN);

        if (_includeAddrChecksum) {
            bytes32 addrStrHash = keccak256(tmp);

            uint256 offset = 0;

            for (uint256 i = 0; i < ETH_ADDRESS_BYTE_LEN; i++) {
                uint8 b = uint8(addrStrHash[i]);

                _addressStringChecksumChar(tmp, offset++, b >> 4);
                _addressStringChecksumChar(tmp, offset++, b & 0x0f);
            }
        }

        // the correct checksum is now in the tmp variable.
        // we extend this by the Ethereum usual prefix 0x

        addrStr = new bytes(ETH_ADDRESS_HEX_LEN + 2);

        addrStr[0] = "0";
        addrStr[1] = "x";

        for (uint256 i = 0; i < ETH_ADDRESS_HEX_LEN; i++) {
            addrStr[i + 2] = tmp[i];
        }

        return addrStr;
    }

    /**
     * @dev returns the hash for the provided claim target address.
     * @param _claimToAddr address target address for the claim.
     * @param _claimAddrChecksum bool target address was signed using the Ethereum checksum (EIP-55)
     * @return bytes32 Bitcoin hash of the claim message.
     */
    function createClaimMessage(
        address _claimToAddr,
        bool _claimAddrChecksum,
        bytes memory _postfix
    ) public view returns (bytes memory) {
        //TODO: pass this as an argument. evaluate in JS before includeAddrChecksum is used or not.
        //now for testing, we assume Yes.

        bytes memory addrStr = calculateAddressString(_claimToAddr, _claimAddrChecksum);

        return
            abi.encodePacked(
                BITCOIN_SIG_PREFIX_LEN,
                BITCOIN_SIG_PREFIX_STR,
                uint8(prefixStr.length) + ETH_ADDRESS_HEX_LEN + 2 + uint8(_postfix.length),
                prefixStr,
                addrStr,
                _postfix
            );
    }

    /**
     * @dev returns the hash for the provided claim target address.
     * @param _claimToAddr address target address for the claim.
     * @param _claimAddrChecksum bool target address was signed using the Ethereum checksum (EIP-55)
     * @return bytes32 DMD style hash of the claim message.
     */
    function getHashForClaimMessage(
        address _claimToAddr,
        bool _claimAddrChecksum,
        bytes memory _postfix
    ) public view returns (bytes32) {
        return calcHash256(createClaimMessage(_claimToAddr, _claimAddrChecksum, _postfix));
    }

    /**
     * @dev returns the ethereum pseude address of a DMD signed message.
     * @param _claimToAddr address target address for the claim.
     * @param _claimAddrChecksum bool target address was signed using the Ethereum checksum (EIP-55)
     * @param _v uint8 v component of the signature.
     * @param _r bytes32 r component of the signature.
     * @param _s bytes32 s component of the signautre.
     * @return address DMD pseudo address of the signer.
     * (what would be the address if the same Private Key would have been used on an DMDv3 than in DMDv4)
     */
    function getEthAddressFromSignature(
        address _claimToAddr,
        bool _claimAddrChecksum,
        bytes memory _postfix,
        uint8 _v,
        bytes32 _r,
        bytes32 _s
    ) public view returns (address) {
        //require(_v >= 27 && _v <= 30, "v invalid");

        /* Create and hash the claim message text */
        bytes32 messageHash = calcHash256(createClaimMessage(_claimToAddr, _claimAddrChecksum, _postfix));

        return ecrecover(messageHash, _v, _r, _s);
    }

    function claimMessageMatchesSignature(
        address _claimToAddr,
        bool _claimAddrChecksum,
        bytes memory _postFix,
        bytes32 _pubKeyX,
        bytes32 _pubKeyY,
        uint8 _v,
        bytes32 _r,
        bytes32 _s
    ) public view returns (bool) {
        require(_v >= 27 && _v <= 30, "v invalid");

        /*
          ecrecover() returns an Eth address rather than a public key, so
          we must do the same to compare.
      */
        address pubKeyEthAddr = pubKeyToEthAddress(_pubKeyX, _pubKeyY);

        //we need to check if X and Y corresponds to R and S.

        /* Create and hash the claim message text */
        bytes32 messageHash = getHashForClaimMessage(_claimToAddr, _claimAddrChecksum, _postFix);

        /* Verify the public key */
        return ecrecover(messageHash, _v, _r, _s) == pubKeyEthAddr;
    }

    function getDilutionTimestamp1() public view returns (uint256) {
        return deploymentTimestamp + (DAY_IN_SECONDS * 2 * 31) + DAY_IN_SECONDS * 30;
    }

    function getDilutionTimestamp2() public view returns (uint256) {
        return deploymentTimestamp + (DAY_IN_SECONDS * 3 * 31) + (DAY_IN_SECONDS * 3 * 30);
    }

    function getDilutionTimestamp3() public view returns (uint256) {
        return deploymentTimestamp + (YEAR_IN_SECONDS * 4) + LEAP_YEAR_IN_SECONDS;
    }

    /**
     * @dev dilutes the entitlement after a certain time passed away and sends it to the beneficor (reinsert pot)
     * @return amount of DMD that got send to the beneficor.
     */
    function dilute1() public returns (uint256) {
        require(
            block.timestamp > getDilutionTimestamp1(),
            "dilute1 can only get called after the treshold timestamp got reached."
        );
        require(dilution_s1_75_executed == false, "dilute1 event did already happen!");

        dilution_s1_75_executed = true;
        // in dilute 1: after 3 months 25% of the total coins get diluted.

        uint256 totalBalance = (payable(address(this))).balance;
        uint256 dilutionBalance = totalBalance / 4;

        _sendDilutedAmounts(dilutionBalance);

        return dilutionBalance;
    }

    /**
     * @dev dilutes the entitlement after a certain time passed away and sends it to the beneficor (reinsert pot)
     * @return amount of DMD that got send to the beneficor.
     */
    function dilute2() public returns (uint256) {
        require(
            block.timestamp > getDilutionTimestamp2(),
            "dilute2 can only get called after the treshold timestamp got reached."
        );
        require(
            dilution_s1_75_executed == true,
            "dilute2 can't get processed unless dilute1 has already been processed."
        );
        require(dilution_s2_50_executed == false, "dilute2 event did already happen!");

        dilution_s2_50_executed = true;
        // in dilute 1: after 3 months 25% of the total coins get diluted.

        uint256 totalBalance = (payable(address(this))).balance;

        // during dilute2,
        // 25% from dilute1 are already counted away from totalBalance.
        // means 3/4 of the value is still there and we need to get it to 2/4.
        // we can do this by dilluting another 1 / 3.

        uint256 dilutionBalance = totalBalance / 3;

        _sendDilutedAmounts(dilutionBalance);

        return dilutionBalance;
    }

    /**
     * @dev dilutes the entitlement after a certain time passed away and sends it to the beneficor (reinsert pot)
     * @return amount of DMD that got send to the beneficor.
     */
    function dilute3() public returns (uint256) {
        require(
            block.timestamp > getDilutionTimestamp3(),
            "dilute3 can only get called after the treshold timestamp got reached."
        );
        require(
            dilution_s1_75_executed == true,
            "dilute3 can't get processed unless dilute1 has already been processed."
        );
        require(
            dilution_s2_50_executed == true,
            "dilute3 can't get processed unless dilute2 has already been processed."
        );
        require(dilution_s3_0_executed == false, "dilute3 event did already happen!");

        dilution_s1_75_executed = true;
        // in dilute 1: after 3 months 25% of the total coins get diluted.

        uint256 totalBalance = (payable(address(this))).balance;

        // 50% got already diluted. this is the last phase, we dilute the rest.
        _sendDilutedAmounts(totalBalance);

        return totalBalance;
    }

    function getCurrentDilutedClaimFactor() public view returns (uint256 nominator, uint256 denominator) {
        if (!dilution_s1_75_executed) {
            return (1, 1);
        } else if (!dilution_s2_50_executed) {
            return (3, 4);
        } else if (!dilution_s3_0_executed) {
            return (1, 2);
        } else {
            return (0, 1);
        }
    }

    function addBalance(bytes20 oldAddress) public payable {
        require(balances[oldAddress] == 0, "There is already a balance defined for this old address");
        balances[oldAddress] = msg.value;
        // allOldAdresses.push(oldAddress);
    }

    function claim(
        address payable _targetAdress,
        bool _claimAddrChecksum,
        bytes memory _postfix,
        bytes32 _pubKeyX,
        bytes32 _pubKeyY,
        uint8 _v,
        bytes32 _r,
        bytes32 _s
    ) public {
        //retrieve the oldAddress out of public and private key.
        bytes20 oldAddress = publicKeyToBitcoinAddress(_pubKeyX, _pubKeyY, AddressType.LegacyCompressed);

        //if already claimed, it just returns.
        uint256 currentBalance = balances[oldAddress];
        require(currentBalance > 0, "provided address does not have a balance.");

        // verify if the signature matches to the provided pubKey here.
        require(
            claimMessageMatchesSignature(_targetAdress, _claimAddrChecksum, _postfix, _pubKeyX, _pubKeyY, _v, _r, _s),
            "Signature does not match for this claiming procedure."
        );

        (uint256 nominator, uint256 denominator) = getCurrentDilutedClaimFactor();

        // the nominator is 0 if the claim period passed.
        require(nominator > 0, "claiming period has already passed.");

        uint256 claimBalance = (currentBalance * nominator) / denominator;

        // remember that the funds are going to get claimed, hard protection about reentrancy attacks.
        balances[oldAddress] = 0;
        _targetAdress.transfer(claimBalance);

        emit Claim(oldAddress, _targetAdress, claimBalance, nominator, denominator);
    }
}
