
import base58check from 'base58check';
//import { toBase58Check, fromBase58Check } from 'bitcoinjs-lib/types/address';

//var bs58check = require('bs58check');

/**
 * Crypto functions used in this project implemented in JS.
 */
export class CryptoJS {

  public constructor() {
    
  }

  public async messageToHash(messageString: string) {

    // const buffer = Buffer.from(messageString, 'utf-8');
    // const hash =  await this.instance.methods.calcHash256(buffer.toString('hex')).call();
    // console.log('messageToHash');
    // console.log(hash);
    // return hash;
  }

  /**
   * 
   * @param address dmd or bitcoin style address.
   * @return Buffer with the significant bytes of the public key, not including the version number prefix, or the checksum postfix.
   */
  public dmdAddressToRipeResult(address: string) : Buffer {

    console.log('address:', address);
    const decoded  = base58check.decode(address);
    console.log('decoded:', decoded);
    return decoded.data;
  }

  public signatureBase64ToRSV(signatureBase64: string) : { r: Buffer, s: Buffer, v: number }
  {
    const sig = Buffer.from(signatureBase64, 'base64');

    //r: 2077b616f680b086c812f6f8ee9ad2160deb5cd1e513dd69d9662da712293c0d
    //s: f45bace0bf3c1cdf043dd279c0d762db2f668aa376b48e381b37ac4cec43aefe
    //v: 17

    console.log('sigBuffer:');
    console.log(sig);
    console.log(sig.toString('hex'));

    //thesis: 
    // 20 is a header, and v is not included in the signature ?
    const sizeOfRComponent = sig[0];
    console.log('sizeOfR:', sizeOfRComponent);

    const rStart = 1; // r Start is always one (1).
    const sStart = 1 + sizeOfRComponent;
    const sizeOfSComponent = sig.length - sStart;
    console.log('sizeOfS:', sizeOfSComponent);
    
    if (sizeOfRComponent > sig.length) {
      throw new Error('sizeOfRComponent is too Big!!');
    }
    const r = sig.subarray(rStart, rStart + sizeOfRComponent);
    const s = sig.subarray(sStart, 65);
    const v = 0; //sig[64];

    console.log(`r: ${r.toString('hex')}`);
    console.log(`s: ${s.toString('hex')}`);
    console.log(`v: ${v}`);

    return { r, s, v };
  }



    
}
