pragma solidity >=0.6.2 <0.7.0;

contract ClaimContract {

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

    return ecrecover(
      _hash,
      _v + 4,
      _r,
      _s
      );

  }
}
