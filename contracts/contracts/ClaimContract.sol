pragma solidity >=0.6.2 <0.7.0;

contract ClaimContract {

  enum AddressType { LegacyUncompressed, LegacyCompressed, SegwitUncompressed, SegwitCompressed }

  bytes16 internal constant HEX_DIGITS = "0123456789abcdef";

  /* Constants for preparing the claim message text */
  uint8 internal constant ETH_ADDRESS_BYTE_LEN = 20;
  uint8 internal constant ETH_ADDRESS_HEX_LEN = ETH_ADDRESS_BYTE_LEN * 2;
  uint8 internal constant CLAIM_PARAM_HASH_BYTE_LEN = 12;
  uint8 internal constant CLAIM_PARAM_HASH_HEX_LEN = CLAIM_PARAM_HASH_BYTE_LEN * 2;
  uint8 internal constant BITCOIN_SIG_PREFIX_LEN = 24;
  bytes24 internal constant BITCOIN_SIG_PREFIX_STR = "Bitcoin Signed Message:\n";

  mapping (bytes20 => uint256) public balances;

  constructor() public {

  }

  function fill(bytes20[] memory _accounts,uint256[] memory _balances)
  public
  payable
  {
    //for simplification we only support a one-shot initialisation.
    require(address(this).balance == 0,
        "The Claim contract is already filled and cannot get filled a second time.");
    require(msg.value > 0, "there must be a value to fill up the ClaimContract");
    require(_accounts.length == _balances.length);

    // we verify if the transfered amount that get added to the sum up to the total amount added.
    uint256 totalBalanceAdded = 0;

    for(uint256 i = 0; i < _accounts.length; i++) {
        require(_accounts[i] != bytes20(0x0000000000000000000000000000000000000000), "Account cannot be 0x0!");
        require(_balances[i] != 0, "Balance cannot be 0!");
        require(balances[_accounts[i]] == 0, "Balance is defined multiple times for an account.");
        totalBalanceAdded += _balances[i];
        balances[_accounts[i]] =  _balances[i];
    }

    require(msg.value == totalBalanceAdded, "The payment for this function must be equal to the sum of all balances.");
  }


  function getPublicKeyFromBitcoinSignature(bytes32 hashValue, bytes32 r, bytes32 s, uint8 v)
  public
  pure
  returns(address)
  {
    require(v >= 4, 'Bitcoin adds a constant 4 to the v value. this signature seems to be invalid.');
    //#1: decode bitcoin signature.
    //# get R, S, V and Hash of Signature.
    //# do ecrecover on it.
    //return "todo: implement this magic!";

    return ecrecover(
        hashValue,
        v - 4, //bitcoin signature use v that is +4 see reddit comment https://www.reddit.com/r/ethereum/comments/3gmbkx/how_do_i_verify_a_bitcoinsigned_message_in_an/ctzopoz
        r,
        s
    );
  }

    /// @dev returns the essential part of a Bitcoin-style address associated with an ECDSA public key
    /// @param a_publicKeyX X coordinate of the ECDSA public key
    /// @param a_publicKeyY Y coordinate of the ECDSA public key
    /// @param a_nAddressType Whether DMD is Legacy or Segwit address and if it was compressed
    /// @return Raw parts of the Bitcoin Style address
    function PublicKeyToBitcoinAddress(
        bytes32 a_publicKeyX,
        bytes32 a_publicKeyY,
        AddressType a_nAddressType
    ) public pure returns (bytes20)
    {
        bytes20 publicKey;
        uint8 initialByte;
        if(a_nAddressType == AddressType.LegacyCompressed || a_nAddressType == AddressType.SegwitCompressed)
        {
            //Hash the compressed format
            initialByte = (uint256(a_publicKeyY) & 1) == 0 ? 0x02 : 0x03;
            publicKey = ripemd160(abi.encodePacked(sha256(abi.encodePacked(initialByte, a_publicKeyX))));
        }
        else
        {
            //Hash the uncompressed format
            initialByte = 0x04;
            publicKey = ripemd160(abi.encodePacked(sha256(abi.encodePacked(initialByte, a_publicKeyX, a_publicKeyY))));
        }

        if(a_nAddressType == AddressType.LegacyUncompressed || a_nAddressType == AddressType.LegacyCompressed)
        {
            return publicKey;
        }
        else if(a_nAddressType == AddressType.SegwitUncompressed || a_nAddressType == AddressType.SegwitCompressed)
        {
            return ripemd160(abi.encodePacked(sha256(abi.encodePacked(hex"0014", publicKey))));
        }
    }


    /// @dev Convert an uncompressed ECDSA public key into an Ethereum address
    /// @param a_publicKeyX X parameter of uncompressed ECDSA public key
    /// @param a_publicKeyY Y parameter of uncompressed ECDSA public key
    /// @return Ethereum address generated from the ECDSA public key
    function PublicKeyToEthereumAddress(
        bytes32 a_publicKeyX,
        bytes32 a_publicKeyY
    ) public pure returns (address)
    {
        bytes32 hash = keccak256(abi.encodePacked(a_publicKeyX, a_publicKeyY));
        return address(uint160(uint256((hash))));
    }

    /// @dev Validate ECSDA signature was signed by the specified address
    /// @param _hash Hash of signed data
    /// @param _v v parameter of ECDSA signature
    /// @param _r r parameter of ECDSA signature
    /// @param _s s parameter of ECDSA signature
    /// @param _address Ethereum address matching the signature
    /// @return Boolean on if the signature is valid
    function ValidateSignature(
        bytes32 _hash,
        uint8 _v,
        bytes32 _r,
        bytes32 _s,
        address _address
    ) public pure returns (bool)
    {
        return ecrecover(
            _hash,
            _v,
            _r,
            _s
        ) == _address;
    }


    /// @dev Validate the ECDSA parameters of signed message
    /// ECDSA public key associated with the specified Ethereum address
    /// @param _addressClaiming Address within signed message
    /// @param _publicKeyX X parameter of uncompressed ECDSA public key
    /// @param _publicKeyY Y parameter of uncompressed ECDSA public key
    /// @param _v v parameter of ECDSA signature
    /// @param _r r parameter of ECDSA signature
    /// @param _s s parameter of ECDSA signature
    /// @return Boolean on if the signature is valid
    function ECDSAVerify(
        address _addressClaiming,
        bytes32 _publicKeyX,
        bytes32 _publicKeyY,
        uint8 _v,
        bytes32 _r,
        bytes32 _s
    ) public pure returns (bool)
    {
        bytes memory addressAsHex = createClaimMessage(_addressClaiming, true);

        bytes32 hHash = sha256(abi.encodePacked(sha256(abi.encodePacked(addressAsHex))));

        return ValidateSignature(
            hHash,
            _v,
            _r,
            _s,
            PublicKeyToEthereumAddress(_publicKeyX, _publicKeyY)
        );
    }

  function checkSignature(bytes32 _hash, bytes32 _r, bytes32 _s, uint8 _v)
  public
  pure
  returns(address)
  {
    return ecrecover(
      _hash,
      _v,
      _r,
      _s
      );
  }

  /**
    * @dev PUBLIC FACING: Derive an Ethereum address from an ECDSA public key
    * @param pubKeyX First  half of uncompressed ECDSA public key
    * @param pubKeyY Second half of uncompressed ECDSA public key
    * @return Derived Eth address
    */
  function pubKeyToEthAddress(bytes32 pubKeyX, bytes32 pubKeyY)
      public
      pure
      returns (address)
  {
      return address(uint160(uint256(keccak256(abi.encodePacked(pubKeyX, pubKeyY)))));
  }

  /**
  * @dev sha256(sha256(data))
  * @param data Data to be hashed
  * @return 32-byte hash
  */
  function calcHash256(bytes memory data)
      public
      pure
      returns (bytes32)
  {
      // NOTE: https://github.com/axic/ethereum-bsm/blob/master/bsm.sol
      // maybe encodePacked is not required ?!
      return sha256(abi.encodePacked(sha256(data)));
  }

      function _hexStringFromData(bytes memory hexStr, bytes32 data, uint256 startOffset, uint256 dataLen)
        private
        pure
    {
        uint256 offset = startOffset;



        for (uint256 i = 0; i < dataLen; i++) {
            uint8 b = uint8(data[i]);

            hexStr[offset++] = HEX_DIGITS[b >> 4];
            hexStr[offset++] = HEX_DIGITS[b & 0x0f];
        }
    }

    function _addressStringChecksumChar(bytes memory addrStr, uint256 offset, uint8 hashNybble)
    private
    pure
    {
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

      addrStr[0] = '0';
      addrStr[1] = 'x';

      for (uint256 i = 0; i < ETH_ADDRESS_HEX_LEN; i++) {
          addrStr[i+2] = tmp[i];
      }

      return addrStr;
  }

  /**
  * @dev returns the hash for the provided claim target address.
  * @param _claimToAddr address target address for the claim.
  * @param _claimAddrChecksum bool target address was signed using the Ethereum checksum (EIP-55)
  * @return bytes32 DMD style hash of the claim message.
  */
  function createClaimMessage(address _claimToAddr, bool _claimAddrChecksum)
        public
        pure
        returns (bytes memory)
    {
        bytes memory prefixStr = "";

        //TODO: pass this as an argument. evaluate in JS before includeAddrChecksum is used or not.
        //now for testing, we assume Yes.

        bytes memory addrStr = calculateAddressString(_claimToAddr, _claimAddrChecksum);

        return abi.encodePacked(
                BITCOIN_SIG_PREFIX_LEN,
                BITCOIN_SIG_PREFIX_STR,
                uint8(prefixStr.length) + ETH_ADDRESS_HEX_LEN + 2,
                prefixStr,
                addrStr
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
    bool  _claimAddrChecksum)
    public
    pure
    returns (bytes32)
  {
    return calcHash256(
          createClaimMessage(_claimToAddr, _claimAddrChecksum)
      );
  }

  /**
  * @dev returns the ethereum pseude address of a DMD signed message.
  * @param _claimToAddr address target address for the claim.
  * @param _claimAddrChecksum bool target address was signed using the Ethereum checksum (EIP-55)
  * @param _v uint8 v component of the signature.
  * @param _r bytes32 r component of the signature.
  * @param _s bytes32 s component of the signautre.
  * @return address DMD pseudo address of the signer. (what would be the address if the same Private Key would have been used on an DMDv3 than in DMDv4)
  */
  function getEthAddressFromSignature(
    address _claimToAddr,
    bool    _claimAddrChecksum,
    uint8 _v,
    bytes32 _r,
    bytes32 _s
  )
  public
  pure
  returns (address)
  {
    //require(_v >= 27 && _v <= 30, "v invalid");

     /* Create and hash the claim message text */
      bytes32 messageHash = calcHash256(
          createClaimMessage(_claimToAddr, _claimAddrChecksum)
      );

    return ecrecover(messageHash, _v, _r, _s);
  }

  function claimMessageMatchesSignature(
    address _claimToAddr,
    bool    _claimAddrChecksum,
    bytes32 _pubKeyX,
    bytes32 _pubKeyY,
    uint8 _v,
    bytes32 _r,
    bytes32 _s
  )
    public
    pure
    returns (bool)
  {
      require(_v >= 27 && _v <= 30, "v invalid");

      /*
          ecrecover() returns an Eth address rather than a public key, so
          we must do the same to compare.
      */
      address pubKeyEthAddr = pubKeyToEthAddress(_pubKeyX, _pubKeyY);

      //we need to check if X and Y corresponds to R and S.

      /* Create and hash the claim message text */
      bytes32 messageHash = calcHash256(
          createClaimMessage(_claimToAddr, _claimAddrChecksum)
      );

      /* Verify the public key */
      return ecrecover(messageHash, _v, _r, _s) == pubKeyEthAddr;
  }
}