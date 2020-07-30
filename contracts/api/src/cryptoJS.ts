
import base58check from 'base58check';
import EC from 'elliptic'
import { BN } from 'ethereumjs-util';

//import { toBase58Check, fromBase58Check } from 'bitcoinjs-lib/types/address';
//var bs58check = require('bs58check');

const bitcoinMessage = require('bitcoinjs-message');
const secp256k1 = require('secp256k1')

const SEGWIT_TYPES = {
  P2WPKH: 'p2wpkh',
  P2SH_P2WPKH: 'p2sh(p2wpkh)'
}


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
    // where is the encoding of the signature documented ?
    //is that DER encoding ? Or the Significant part of DER ?
    
    const sig = Buffer.from(signatureBase64, 'base64');

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


  public decodeSignature (buffer : Buffer) {

    if (buffer.length !== 65) throw new Error('Invalid signature length')

    const flagByte = buffer.readUInt8(0) - 27
    if (flagByte > 15 || flagByte < 0) {
      throw new Error('Invalid signature parameter')
    }

    return {
      compressed: !!(flagByte & 12),
      segwitType: !(flagByte & 8)
        ? null
        : !(flagByte & 4)
          ? SEGWIT_TYPES.P2SH_P2WPKH
          : SEGWIT_TYPES.P2WPKH,
      recovery: flagByte & 3,
      signature: buffer.slice(1)
    }
  }

  public getPublicKeyFromSignature(signatureBase64: string, messageContent: string) : {publicKey: string, x: string, y: string} {
    
    //const signatureBase64 = "IBHr8AT4TZrOQSohdQhZEJmv65ZYiPzHhkOxNaOpl1wKM/2FWpraeT8L9TaphHI1zt5bI3pkqxdWGcUoUw0/lTo=";
    //const address = "";

    const signature = Buffer.from(signatureBase64, 'base64');

    const parsed = this.decodeSignature(signature);
    console.log('parsed Signature:', parsed);

    const hash = bitcoinMessage.magicHash(messageContent);

    const publicKey = secp256k1.recover(
      hash,
      parsed.signature,
      parsed.recovery,
      parsed.compressed
    )

    //we now have the public key
    //public key is the X Value with a prefix.
    //it's 02 or 03 prefix, depending if y is ODD or not.
    console.log("publicKey: ", publicKey.toString('hex'));

    const x = publicKey.slice(1).toString('hex');
    console.log("x: " + x);

        
    var ec = new EC.ec('secp256k1');

    const key = ec.keyFromPublic(publicKey);
    const y = key.getPublic().getY().toString('hex');

    console.log("y: " + y);

    return {publicKey: publicKey.toString('hex'), x, y};
  }
}
