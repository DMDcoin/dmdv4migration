

import ClaimContract from '../contracts/ClaimContract.d';

import web3 from 'web3';

export class TestFunctions {

  public constructor(public web3Instance: web3, public instance : ClaimContract.ClaimContract) {
    
  }

  


  public async testValidateSignature() {

    

    let addressToSign = '0x70A830C7EffF19c9Dd81Db87107f5Ea5804cbb3F';
    let dmdAddress = 'dR9uN3GXDikmiipy3p8L9fJ4pzCiHYfcrz';

    //signature seems to be encoded base64 instead of base58.
    let dmdSignature = 'IIJrgH2LVfla214fObfGHMvEVxmEMtZjXK9fCT/3PWpnYSzGS0AZWzXDhGKt9wjX6Z6V0qS1gFNE7RZeUSD61CU=';

    //130 chars = 65 bytes => R, S, V.
    let dmdSignatureHex2 = '0x20826b807d8b55f95adb5e1f39b7c61ccbc457198432d6635caf5f093ff73d6a67612cc64b40195b35c38462adf708d7e99e95d2a4b5805344ed165e5120fad425';
    


    const hashOfSignedInfo = "";

    let sig = Buffer.from(dmdSignatureHex2, 'hex')
    
    if (sig.byteLength != 65) {
      throw Error("Expected length of 65");
    }

    console.log(sig);
    
    let r = Uint8Array.from( sig.slice(0, 32));
    let s = Uint8Array.from(sig.slice(32, 64));
    let v = Uint8Array.from(sig.slice(64, 65));

    console.log('r', r);
    console.log('s', s);
    console.log('v', v);

    //this.instance.methods.getPublicKeyFromBitcoinSignature(hashOfSignedInfo,  );


    return "scheisse";
  };
}