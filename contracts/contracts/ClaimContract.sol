pragma solidity >=0.6.2 <0.7.0;


import {EC} from  './EC.sol';


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

  mapping (string => uint256)  public balances;

  constructor() public {
    //balances[""] = 1000000000000;
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


//  function getPublicKeyFromSignature(bytes65 memory signatureBytes)
//  public
//  pure
//  returns(string memory)
//  {
    //#1: decode bitcoin signature.
    //# get R, S, V and Hash of Signature.
    //# do ecrecover on it.
    //return "todo: implement this magic!";
//  }



    /// @dev Calculate the Bitcoin-style address associated with an ECDSA public key
    /// @param a_publicKeyX First half of ECDSA public key
    /// @param a_publicKeyY Second half of ECDSA public key
    /// @param a_nAddressType Whether DMD is Legacy or Segwit address and if it was compressed
    /// @return Raw DMD address
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


  function r()
  internal
  pure
  returns(bytes32)
  {
      return 0x0b7effb7704f726bc64139753dc2d0a3929af2309dd2930ad7a722f5b214cf6e;
  }

  function s()
  internal
  pure
  returns(bytes32)
  {
      return 0x73a461ce418e9e483f13a98c0cba5cddf07f647ea1d6ba2e88d494dfcd411c9c;
  }

  function v()
  internal
  pure
  returns(uint8) {
      return 32;  //equal to 0x20
  }

  function v2()
  internal
  pure
  returns(uint8)
  {
      return v()-4;   //bitcoin signature use v that is +4 see reddit comment https://www.reddit.com/r/ethereum/comments/3gmbkx/how_do_i_verify_a_bitcoinsigned_message_in_an/ctzopoz
  }

  function hashToSign()
  internal
  pure
  returns(bytes32)
  {
      return 0x58e2f335bbd6f2b0da93eae19342e7309654fbfeed9a214a1e5d835ac09cc226;
  }

  function expectedAddress()
  internal
  pure
  returns(address)
  {
      return 0x31031dF1d95a84fC21E80922CcdF83971F3e755b;
  }

  function isValid()
  public
  pure
  returns(bool)
  {   //this returns true!!!
      return expectedAddress()==testECRecover();
  }

  function testECRecover()
  public
  pure
  returns(address)
  {
    return ecrecover(
        hashToSign(),
        v2(),
        r(),
        s()
        );
  }

//   function extract(bytes memory data, uint pos)
//   public
//   pure
//   returns (bytes32)
//   {
//     bytes32 result;

//     for (uint32 i = 0; i < 32; i++)
//     {
//         result[i] = data[i+pos];
//     }

//     return result;
//   }

  // function checkSignature(bytes32 h, uint8 v, bytes32 r, bytes32 s)
  // public
  // pure
  // returns (address signer)
  // {
  //   bytes memory prefix = "\x19Ethereum Signed Message:\n32";
  //   bytes32 prefixedHash = keccak256(abi.encodePacked(prefix,h));  
  //   signer = ecrecover(prefixedHash, v, r, s); 
  // }

  function checkSignature(bytes32 _hash, bytes32 _r, bytes32 _s, uint8 _v)
  public
  pure
  returns(address)
  {
    //P2PKH
    //the _btcAddress is incomming here, it is the hash of the public key.
    //ecrecover returns the public key.
    //to calculate the BTCAddress:
    //The Public Key is duplicated and the RIPEMD is calculated out of it.

    // 40 hex: 12ab8dc588ca9d5787dde7eb29569da63c3a238c
    // 20 bytes
    // public key size ?!

    //

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
  * @param addr address
  * @param includeAddrChecksum bool. should the addressChecksum be used for this caluclation.
  * @return addrStr ethereum address(24 byte)
  */
  function calculateAddressString(address addr, bool includeAddrChecksum)
    public
    pure
    returns (bytes memory addrStr)
  {
      bytes memory tmp = new bytes(ETH_ADDRESS_HEX_LEN);
      _hexStringFromData(tmp, bytes32(bytes20(addr)), 0, ETH_ADDRESS_BYTE_LEN);

      if (includeAddrChecksum) {
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


  function createClaimMessage(address claimToAddr, bool claimToAddrChecksum)
        public
        pure
        returns (bytes memory)
    {
        bytes memory prefixStr = "";

        //TODO: pass this as an argument. evaluate in JS before includeAddrChecksum is used or not.
        //now for testing, we assume Yes.

        bytes memory addrStr = calculateAddressString(claimToAddr, claimToAddrChecksum);

        return abi.encodePacked(
                BITCOIN_SIG_PREFIX_LEN,
                BITCOIN_SIG_PREFIX_STR,
                uint8(prefixStr.length) + ETH_ADDRESS_HEX_LEN,
                prefixStr,
                addrStr
            );
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