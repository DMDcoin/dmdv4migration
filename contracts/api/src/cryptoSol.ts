
import Web3 from 'web3';
import ClaimContract from '../contracts/ClaimContract';
import { ensure0x } from './cryptoHelpers';

/**
 * Crypto functions used in this project implemented in Soldity.
 */
export class CryptoSol {

  public constructor(public web3Instance: Web3, public instance : ClaimContract.ClaimContract) {
    
    if (instance === undefined || instance === null) {
      throw Error("Claim contract must be defined!!");
    }

    console.log('constructed!');
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
    console.log('Claim Message:');
    console.log(claimMessage);
    return claimMessage;
  }

  public async messageToHash(messageString: string) {

    const buffer = Buffer.from(messageString, 'utf-8');
    const hash =  await this.instance.methods.calcHash256(buffer.toString('hex')).call();
    console.log('messageToHash');
    console.log(hash);
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
      console.log('Claim Result: ', result);
      return result;
    }

    public async getSignatureEthAddress(
      claimToAddress: string,
      addressContainsChecksum: boolean,
      sigV: string,
      sigR: string | Buffer,
      sigS: string | Buffer) 
      : Promise<string> {

      return this.instance.methods.getSignatureEthAddress(
        claimToAddress, 
        addressContainsChecksum,
        ensure0x(sigV),
        ensure0x(sigR), 
        ensure0x(sigS)
      ).call();

    }
}
