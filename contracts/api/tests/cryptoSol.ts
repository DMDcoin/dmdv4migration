
import Web3 from 'web3';
import ClaimContract from '../contracts/ClaimContract.d'

/**
 * Crypto functions used in this project implemented in Soldity.
 */
export class CryptoJS {

  public constructor(public web3Instance: Web3, public instance : ClaimContract.ClaimContract) {
    
    if (instance === undefined || instance === null) {
      throw Error("Claim contract must be defined!!");
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
    console.log('Claim Message:');
    console.log(claimMessage);
    return claimMessage;

  }

  public messageToHash(message: string) {

  }


    
}
