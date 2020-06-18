

import ClaimContract from '../contracts/ClaimContract.d';

import web3 from 'web3';

export class TestFunctions {

  public constructor(public web3Instance: web3, public instance : ClaimContract.ClaimContract) {
    
  }

  public async testValidateSignature() {

    

    //let addressToSign = '0x70A830C7EffF19c9Dd81Db87107f5Ea5804cbb3F';
    //let dmdAddress = 'dR9uN3GXDikmiipy3p8L9fJ4pzCiHYfcrz';

    //signature seems to be encoded base64 instead of base58.
    //let dmdSignature = 'IIJrgH2LVfla214fObfGHMvEVxmEMtZjXK9fCT/3PWpnYSzGS0AZWzXDhGKt9wjX6Z6V0qS1gFNE7RZeUSD61CU=';


    const addressToSign = "0x70A830C7EffF19c9Dd81Db87107f5Ea5804cbb3F";
    const dmdSignature = "IHe2FvaAsIbIEvb47prSFg3rXNHlE91p2WYtpxIpPA30W6zgvzwc3wQ90nnA12LbL2aKo3a0jjgbN6xM7EOu/hE=";
    const dmdAddress = "1BzFQE9RWjNQEuN2pJTFEHN21LureERhKX";

    let sig = new Buffer(dmdSignature, 'base64');

    //console.log('Length: ' + dmdSignatureBuffer.length);

    //130 chars = 65 bytes => R, S, V.
    //let dmdSignatureHex2 = '20826b807d8b55f95adb5e1f39b7c61ccbc457198432d6635caf5f093ff73d6a67612cc64b40195b35c38462adf708d7e99e95d2a4b5805344ed165e5120fad425';
    //let dmdSignatureHex = '20826b807d8b55f95adb5e1f39b7c61ccbc457198432d6635caf5f093ff73d6a67612cc64b40195b35c38462adf708d7e99e95d2a4b5805344ed165e5120fad425';



    const hashOfSignedInfo = "";

    
    if (sig.byteLength != 65) {
      throw Error("Expected length of 65. got: " + sig.byteLength);
    }

    console.log(sig);
    
    let v = Array.from(sig.slice(0, 1));
    let r = Array.from( sig.slice(1, 33));
    let s = Array.from(sig.slice(33, 65));
    

    console.log('r', r);
    console.log('s', s);
    console.log('v', v);

    

    
    //console.log(bitcore.fromString);
    // const pubKeyResult = await this.instance.methods.getPublicKeyFromBitcoinSignature(hashOfSignedInfo, r, s, v[0]).call();
    // console.log('PublicKey:' + pubKeyResult);

    // return pubKeyResult;

    

    
  };
}

const test = new TestFunctions(null, null);
test.testValidateSignature();