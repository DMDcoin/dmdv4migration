
import Web3 from 'web3';
import ClaimContract from '../contracts/ClaimContract';
import { ensure0x } from './cryptoHelpers';
import { BN } from 'ethereumjs-util';
import { CryptoJS } from './cryptoJS';
/**
 * Crypto functions used in this project implemented in Soldity.
 */
export class CryptoSol {

  public cryptoJS = new CryptoJS();
  
  private logDebug: boolean = false; 


  public constructor(public web3Instance: Web3, public instance : ClaimContract.ClaimContract) {
    
    if (instance === undefined || instance === null) {
      throw Error("Claim contract must be defined!!");
    }

    this.log('constructed!');
  }

  public setLogDebug(value: boolean) {
    this.logDebug = value;
    this.cryptoJS.setLogDebug(value);
  }

  private log(message: string, ...params: any[]) {
    if (this.logDebug) {
      console.log(message, ...params);
    }
  }


  public addressToHashToSign(address: string) {

  }

  /**
   * Retrieves the message that is used for hashing in bitcoin. (enpacking it with the Envolope)
   * see also: https://bitcoin.stackexchange.com/questions/77324/how-are-bitcoin-signed-messages-generated
   * @param address Ethereum style address, include checksum information.
   */
  public async addressToClaimMessage(address: string) : Promise<string> {

    const claimMessage =  await this.instance.methods.createClaimMessage(address, true).call();
    this.log('Claim Message:');
    this.log(claimMessage);
    return claimMessage;
  }

  public async messageToHash(messageString: string) {

    const buffer = Buffer.from(messageString, 'utf-8');
    const hash =  await this.instance.methods.calcHash256(buffer.toString('hex')).call();
    this.log('messageToHash');
    this.log(hash);
    return hash;
  }


  public async claimMessageMatchesSignature(
    claimToAddress: string,
    addressContainsChecksum: boolean,
    pubkeyX: string,
    pubkeyY: string,
    sigV: string,
    sigR: string,
    sigS: string) :
    Promise<boolean>
    {
      const result = 
        await this.instance.methods.claimMessageMatchesSignature(
          claimToAddress, 
          addressContainsChecksum, 
          ensure0x(pubkeyX), 
          ensure0x(pubkeyY), 
          ensure0x(sigV),
          ensure0x(sigR), 
          ensure0x(sigS)).call();
      this.log('Claim Result: ', result);
      return result;
    }

    public async getEthAddressFromSignature(
      claimToAddress: string,
      addressContainsChecksum: boolean,
      sigV: string,
      sigR: string | Buffer,
      sigS: string | Buffer) 
      : Promise<string> {

      return this.instance.methods.getEthAddressFromSignature(
        claimToAddress, 
        addressContainsChecksum,
        ensure0x(sigV),
        ensure0x(sigR), 
        ensure0x(sigS)
      ).call();
    }

    /**
     * returns the essential part of a Bitcoin-style legacy compressed address associated with the given ECDSA public key
     * @param x X coordinate of the ECDSA public key
     * @param y Y coordinate of the ECDSA public key
     * @returns Hex string holding the essential part of the legacy compressed address associated with the given ECDSA public key
     */
    async publicKeyToBitcoinAddressEssential(x: BN, y: BN) : Promise<string> {
      const legacyCompressedEnumValue = 1;
      return this.instance.methods.PublicKeyToBitcoinAddress(
        '0x' + x.toString('hex'),
        '0x' + y.toString('hex'), legacyCompressedEnumValue).call();
    }

    async publicKeyToBitcoinAddress(x: BN, y: BN, addressPrefix: string) {
      const essentialPart = await this.publicKeyToBitcoinAddressEssential(x, y);
      return this.cryptoJS.bitcoinAddressEssentialToFullQualifiedAddress(essentialPart, addressPrefix);
    }

    public async pubKeyToEthAddress(x: string, y: string) {
      return this.instance.methods.pubKeyToEthAddress(x, y).call();
    }
}
