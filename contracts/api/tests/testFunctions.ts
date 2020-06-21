

import ClaimContract from '../contracts/ClaimContract.d';
import web3 from 'web3';

import RIPEMD160 from 'ripemd160'
import sha256 from 'js-sha256'

export class TestFunctions {

  public constructor(public web3Instance: web3, public instance : ClaimContract.ClaimContract) {
    
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

  public signatureBase64ToRSV(signatureBase64: string) : { r: Buffer, s: Buffer, v: number }
  {
    const sig = Buffer.from(signatureBase64, 'base64');

    //r: 2077b616f680b086c812f6f8ee9ad2160deb5cd1e513dd69d9662da712293c0d
    //s: f45bace0bf3c1cdf043dd279c0d762db2f668aa376b48e381b37ac4cec43aefe
    //v: 17

    const r = sig.subarray(0, 32);
    const s = sig.subarray(32,64);
    const v = sig[64];

    console.log(`r: ${r.toString('hex')}`);
    console.log(`s: ${s.toString('hex')}`);
    console.log(`v: ${v}`);

    return { r, s, v };
  }



  public messageToHashToSign(message: string) : Buffer {

    // var buf = Buffer.from(message, 'utf8');
    // console.log(buf);
    // const ripe = new RIPEMD160();
    // ripe.end(buf);

    
    // //console.log(ripe.read().toString('hex'));

    // const readResult =  ripe.read() as Buffer;
    // console.log(readResult.toString('hex'));
    //console.log(readResult.length);

    // https://bitcoin.stackexchange.com/questions/36838/why-does-the-standard-bitcoin-message-signature-include-a-magic-prefix

    

    const bitcoinPrefixString = '\x18Bitcoin Signed Message:\n';
    const bitcoinPrefixBuffer = Buffer.from(bitcoinPrefixString, 'utf8');
    const messageBuffer = Buffer.from(message, 'utf8');

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

    const hashResult = sha256.sha256(messageBuffer);
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

  public async testAddressRecovery() {

    //console.log('running test on instance: ', this.instance);

    const message = "0x70A830C7EffF19c9Dd81Db87107f5Ea5804cbb3F";
    const signatureBase64 = "IHe2FvaAsIbIEvb47prSFg3rXNHlE91p2WYtpxIpPA30W6zgvzwc3wQ90nnA12LbL2aKo3a0jjgbN6xM7EOu/hE=";
    const btcAddressBase64 = "1BzFQE9RWjNQEuN2pJTFEHN21LureERhKX";
    const hash = this.messageToHashToSign(message);

    console.log(`type: ${typeof hash}`);
    console.log(`type: ${hash.toString('hex')}`);

    const sig = this.signatureBase64ToRSV(signatureBase64);
    const hashHex = '0x' + hash.toString('hex');
    const rHex  = '0x' + sig.r.toString('hex');
    const sHex =  '0x' + sig.s.toString('hex');


    const checkSignatureResult = await this.instance.methods.checkSignature(
      hashHex,
      rHex,
      sHex,
      sig.v)
    .call();

    console.log('Recovered Address:');
    console.log(checkSignatureResult);
  }

}

//const test = new TestFunctions(null, null);
//test.testAddressRecovery();