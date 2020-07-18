

import ClaimContract from '../contracts/ClaimContract.d'
import Web3 from 'web3';
import sha256 from 'js-sha256'
import { ecrecover } from 'ethereumjs-util'

import bitcoinMessage from 'bitcoinjs-message'
import bitcoin from 'bitcoinjs-lib'

import CryptoJS from './cryptoJS'

import EC from 'elliptic'

//var ec = new EC('secp256k1');


export class TestFunctions {

  public cryptoJS = new CryptoJS();

  public constructor(public web3Instance: Web3, public instance : ClaimContract.ClaimContract) {
    
    if (instance === undefined || instance === null) {
      throw Error("Claim contract must be defined!!");
    }

    
  }

  // public async testValidateSignature() {

  //   //let addressToSign = '0x70A830C7EffF19c9Dd81Db87107f5Ea5804cbb3F';
  //   //let dmdAddress = 'dR9uN3GXDikmiipy3p8L9fJ4pzCiHYfcrz';
  //   //signature seems to be encoded base64 instead of base58.
  //   //let dmdSignature = 'IIJrgH2LVfla214fObfGHMvEVxmEMtZjXK9fCT/3PWpnYSzGS0AZWzXDhGKt9wjX6Z6V0qS1gFNE7RZeUSD61CU=';

  //   const addressToSign = "0x70A830C7EffF19c9Dd81Db87107f5Ea5804cbb3F";
  //   const btcSignature = "IHe2FvaAsIbIEvb47prSFg3rXNHlE91p2WYtpxIpPA30W6zgvzwc3wQ90nnA12LbL2aKo3a0jjgbN6xM7EOu/hE=";
  //   const btcAddress = "1BzFQE9RWjNQEuN2pJTFEHN21LureERhKX";


  //   const signature = btcSignature;

    
  //   let sig = new Buffer(signature, 'base64');

  //   //console.log('Length: ' + dmdSignatureBuffer.length);

  //   //130 chars = 65 bytes => R, S, V.
  //   //let dmdSignatureHex2 = '20826b807d8b55f95adb5e1f39b7c61ccbc457198432d6635caf5f093ff73d6a67612cc64b40195b35c38462adf708d7e99e95d2a4b5805344ed165e5120fad425';
  //   //let dmdSignatureHex = '20826b807d8b55f95adb5e1f39b7c61ccbc457198432d6635caf5f093ff73d6a67612cc64b40195b35c38462adf708d7e99e95d2a4b5805344ed165e5120fad425';

    
    
  //   if (sig.byteLength != 65) {
  //     throw Error("Expected length of 65. got: " + sig.byteLength);
  //   }

  //   console.log(sig);
    
  //   let v = Array.from(sig.slice(0, 1));
  //   let r = Array.from( sig.slice(1, 33));
  //   let s = Array.from(sig.slice(33, 65));
    

  //   console.log('r', r);
  //   console.log('s', s);
  //   console.log('v', v);

  //   //console.log(bitcore.fromString);
  //   // const pubKeyResult = await this.instance.methods.getPublicKeyFromBitcoinSignature(hashOfSignedInfo, r, s, v[0]).call();
  //   // console.log('PublicKey:' + pubKeyResult);
  //   // return pubKeyResult;
    
  //   const hashOfSignedInfo = "";
    
  // };

  //Ethereum Address to string with checksum

  public runTestEthereumAddressToStringWithChecksum() {

    const address = '0xfec7b00dc0192319dda0c777a9f04e47dc49bd18';
    const addressWithChecksum = '0xfEc7B00DC0192319DdA0c777A9F04E47Dc49bD18';

  }

  public messageToHashToSign(message: string) : Buffer {

  // https://bitcoin.stackexchange.com/questions/36838/why-does-the-standard-bitcoin-message-signature-include-a-magic-prefix

    const bitcoinPrefixString = '\x18Bitcoin Signed Message:\n';
    const bitcoinPrefixBuffer = Buffer.from(bitcoinPrefixString, 'utf8');
    const messageBuffer = Buffer.from(message.length.toString() + message, 'utf8');

    const messageSize = message.length;

    // source code from 
    // https://github.com/bitcoinjs/bitcoinjs-lib/blob/1079bf95c1095f7fb018f6e4757277d83b7b9d07/src/message.js#L13
    // function magicHash (message, network) {
    //   var messagePrefix = new Buffer(network.messagePrefix)
    //   var messageBuffer = new Buffer(message)
    //   var lengthBuffer = bufferutils.varIntBuffer(messageBuffer.length)
    //   var buffer = Buffer.concat([messagePrefix, lengthBuffer, messageBuffer])
    //   return crypto.hash256(buffer)
    // }
    //const string strMessageMagic = "Diamond Signed Message:\n";
    
    const buffer = Buffer.alloc(bitcoinPrefixBuffer.byteLength + messageBuffer.byteLength);
    
    bitcoinPrefixBuffer.copy(buffer, 0);
    messageBuffer.copy(buffer, bitcoinPrefixBuffer.length);


    console.log("Buffer to sign:");
    console.log(buffer.toString('hex'));

    const hashResult = sha256.sha256(sha256.sha256(messageBuffer));
    console.log('HashResult: ' + hashResult);

    // 6b4539ed373c9977a4b66f9abdece0884bb9e546ed4a76855297edb703d05486
    const hashResultString = hashResult as string;

    if (hashResultString) {
      return Buffer.from(hashResultString, 'hex');
    }
    
    throw new Error('sha256 should return a string.');

    //20 byte result
    //return crypto.hash256(buffer)
  }

  public recoveryToXY(strangeResult: any) : {x: string ,y: string} {

    //var EC = require('elliptic').ec;
 
    // Create and initialize EC context
    // (better do it once and reuse it)
    // var ec = new EC.ec('secp256k1');

    
    // const key = ec.keyFromPublic(buf);
    // const publicKey = key.getPublic();


    
    return { 
      x: this.ellipticHexStringToWeb3HexString(strangeResult.x), 
      y: this.ellipticHexStringToWeb3HexString(strangeResult.y),
    }
  }


  // public xyFromRS(buf: Buffer) : {x: string ,y: string} {

  //   //var EC = require('elliptic').ec;
 
  //   // Create and initialize EC context
  //   // (better do it once and reuse it)
  //   var ec = new EC.ec('secp256k1');

  //   const recoverResult = ec.recoverPubKey(msg, signature, 27);
  //   const key = ec.keyFromPublic(buf);
    
  //   const publicKey = key.getPublic();

  //   return { 
  //     x: publicKey.getX().toString(), 
  //     y: publicKey.getX().toString() 
  //   }
  // }


  private ellipticHexStringToWeb3HexString(strangeType: any) : string {

    let ellipticHexString = JSON.stringify(strangeType);
    ellipticHexString = ellipticHexString.replace('"', '').replace('"', '');
    return '0x' + ellipticHexString;
  }

  // public async messageToHashInContract(value: string) : Buffer {
  //   const result27 = await this.instance.methods.claimMessageCreate(message, true, hashHex, xy27.x, xy27.y, 27, rHex, sHex).call();
  // } 

  public async testAddressRecovery() {

    //console.log('running test on instance: ', this.instance);

    const message = "0x70A830C7EffF19c9Dd81Db87107f5Ea5804cbb3F";
    const signatureBase64 = "IHe2FvaAsIbIEvb47prSFg3rXNHlE91p2WYtpxIpPA30W6zgvzwc3wQ90nnA12LbL2aKo3a0jjgbN6xM7EOu/hE=";
    const btcAddressBase64 = "1BzFQE9RWjNQEuN2pJTFEHN21LureERhKX"; //is maybe not base64 - it might be base58 ?

    // Private: L4FkVsvM6FLuwJJHzpHJM6fUdG9acX5QqbvtvTSZRtG3Nsa7J8tv
    // Public : 02bee3163c5ba877f4205ab447fb42373bb1f77e898d0d649dc7c691a483551a37
    // PublicU: 04bee3163c5ba877f4205ab447fb42373bb1f77e898d0d649dc7c691a483551a378036be868fa5ec97c61b08073630c793ec550b77b28d96561ef9e89914b1e3a4


    //const hash = this.messageToHashToSign(message);
    //const hash = this.messageToHashToSign(message);

    const claimMessage =  await this.instance.methods.createClaimMessage(message, true).call();
    console.log('Claim Message:');
    console.log(claimMessage);

    const hashResultSolidity = await this.instance.methods.calcHash256(claimMessage).call();
    console.log('hash Result Solidity:', hashResultSolidity);

    const hash = Buffer.from(hashResultSolidity, 'hex');

    console.log(`hash: ${hash.toString('hex')}`);

    const sig = this.cryptoJS.signatureBase64ToRSV(signatureBase64);
    
    const hashHex = '0x' + hash.toString('hex');
    const rHex  = '0x' + sig.r.toString('hex');
    const sHex =  '0x' + sig.s.toString('hex');

    //this.web3Instance.eth.ercRe
    //const ercRecoverResult27 = ecrecover(hash, 27, sig.r, sig.s);
    //console.log('js ercRecoverResult27: (public key) ' + ercRecoverResult27.toString('hex'));

    //const ercRecoverResult28 = ecrecover(hash, 28, sig.r, sig.s);
    //console.log('js ercRecoverResult28: (public key) ' + ercRecoverResult28.toString('hex'));

    // const checkSignatureResult27 = await this.instance.methods.checkSignature(
    //   hashHex,
    //   rHex,
    //   sHex,
    //   27)
    // .call();

    // const checkSignatureResult28 = await this.instance.methods.checkSignature(
    //   hashHex,
    //   rHex,
    //   sHex,
    //   28)
    // .call();


    // console.log('Recovered Address from solidity:');
    // console.log('27: ' + checkSignatureResult27);
    // console.log('28: ' + checkSignatureResult28);

    
    var ec = new EC.ec('secp256k1');

    //const sig27 = new EC.ec.Signature({ r: rHex, s: sHex, recoveryParam: 27});
    //const sig28 = new EC.ec.Signature({ r: rHex, s: sHex, recoveryParam: 28});


    const sig27 = { r: sig.r.toString('hex'), s: sig.s.toString('hex'), recoveryParam: 0};
    const sig28 = { r: sig.r.toString('hex'), s: sig.s.toString('hex'), recoveryParam: 1};

    //EthECDSASignature signatureNew = EthECDSASignature.FromDER(derSign);

    
    const recoverResult27 = ec.recoverPubKey(hash, sig27, 0);
    const recoverResult28 = ec.recoverPubKey(hash, sig28, 1);
    //const key = ec.keyFromPublic(buf);

    const xy27 = this.recoveryToXY(recoverResult27);
    const xy28 = this.recoveryToXY(recoverResult28);

    console.log('xy27: ', xy27);
    console.log('xy28: ', xy28);

    

    const result27 = await this.instance.methods.claimMessageMatchesSignature(message, true, xy27.x, xy27.y, 27, rHex, sHex).call();
    const result28 = await this.instance.methods.claimMessageMatchesSignature(message,true, xy28.x, xy28.y, 28, rHex, sHex).call();

    console.log('result27: ', result27);
    console.log('result28: ', result28);


  }

  public testBitcoinSignAndRecovery() {

    var keyPair = bitcoin.ECPair.fromWIF('5KYZdUEo39z3FPrtuX2QbbwGnNP5zTd7yyr2SC1j299sBCnWjss');
    
    var privateKey = keyPair.privateKey
    var message = 'This is an example of a signed message.'
 
    var signature = bitcoinMessage.sign(message, privateKey, keyPair.compressed)
    console.log(signature.toString('base64'))

    var signature = bitcoinMessage.sign(message, privateKey, keyPair.compressed, { segwitType: 'p2sh(p2wpkh)' })
    console.log(signature.toString('base64'))
  }

}

//
//const test = new TestFunctions(null, null);
//test.testAddressRecovery();