
import ClaimContract from '../contracts/ClaimContract.d'
import Web3 from 'web3';
import sha256 from 'js-sha256'
import { expect, assert } from 'chai';
import varuint from'varuint-bitcoin';
import { CryptoJS } from '../src/cryptoJS';
import EC from 'elliptic';
import { CryptoSol } from '../src/cryptoSol';
import BN = require('bn.js');
import { remove0x } from '../src/cryptoHelpers';


const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');


export class TestFunctions {

  public cryptoJS = new CryptoJS();
  public cryptoSol : CryptoSol;

  private logDebug: boolean = false; 

  public constructor(public web3Instance: Web3, public instance : ClaimContract.ClaimContract) {
    
    if (instance === undefined || instance === null) {
      throw Error("Claim contract must be defined!!");
    }

    this.cryptoSol = new CryptoSol(web3Instance, instance);
  }

  public setLogDebug(value: boolean) {
    this.logDebug = value;
    this.cryptoSol.setLogDebug(value);
    this.cryptoJS.setLogDebug(value);
  }

  private log(message: string, ...params: any[]) {
    if (this.logDebug) {
      console.log(message, ...params);
    }
  }

  private getTestSignatures() {

    //returns a bunch of test signatures used in various tests.
    //those are created with  https://reinproject.org/bitcoin-signature-tool/#sign
    // the signed message is: "0x70A830C7EffF19c9Dd81Db87107f5Ea5804cbb3F";
    // the private key is: 
    const signaturesBase64 = 
      [ "IA7ZY6Vi52XpL6BKiq74jeP7phdBJO5JqgsEUsmUDZZFNWnsC6X3kknADhJdXCTLcjAUI1bwn1IAVprv/krj7tQ=",
        "IJ42x26AH10GPhfnXdHMzj5KAmjekeaS4sA6uo2unlW+GLJqSSrVW03sYFIouW/oOE6v/uCl5z0jgmbLmOngSXI=",
        "Hw9HBbWTVJkMOqfqy2CscivlB/CzNR3sanGhguYSWtshv5VOjffwEopeES+UnsrLPvYFtgA1jQKWGAyR8lEE3AA=",
        "H1lPAFpDfLx6tSUyWSRmiYeuHbUaGzy2Lx+FhqXyQ+y/DIg3Ep8xGNyrn5hDDDt314UbPB9E5QpI75JoEU3ZUE4=",
        "H+FQO+Am4R+k8hzw9U5ImJLCtikbmr8hqVcGfpdjDMnvPIal7HMIINX8WYhQ1LzxiXKoSFDAnJbS9Q8rBAdtZag=",
        "IOzKhB75qO45TUaXcuHZhW+3fFhFhRHUJhYTK+Rqzlftov1FTt5PeC2p5+tpkF8sYemm5tclPppg4vSt5N0Pp6E=",
        "IE8itTa9jSnTCC2TwJAyFIk60wbXlz8wpN3htH3+Zb5uLH0QZd60IsouCkyIZem16z9DwscFjPeBWOSmYbH26D0=",
        "HzwB2jWF13IxdjadcNU/hEapqGBsIrvJIhHqyWx6t8lK5YM9Wg0A6AZ91wwChjAm55ESymyiciS0dxGI2Uakm88=",
        "IEgJZn56Gd0u5ZnUAXHcCkuBSIHrymvoqsZF8sGDvr0ZiY7yfKJ7RhR4+tWWmjTHHIxOfhv0Wa7FNz7yC8v3LUY=",
        "IIf+kRcuzsQPbR5bW2W1Kz9urfxmsM0MbGYGuhML1pKdS8JLdUEEVEY86KIN/famgcQw43La02LTg142GBlGwaE=",
        "IIdIJSBKUExSabzNhmOtOamrTEnLHQeHEMVPM5BBfvYlTEtG3FvWzIWiAUe0ET4LFLWRkO8e6/TboyqYIT1QxgM=",
        "HxqyFxgt2+wWQB0hi5vt2yW7+3Qly+Rf7gNQIF8Ui+Zbj5JCalRrCcrJn2680QJuRBbIA9uc68wWS2J00LENRR8="
      ];
      return signaturesBase64;
  }

  public async testAddressChecksum() {

    const address = '0xfec7b00dc0192319dda0c777a9f04e47dc49bd18';
    const addressWithChecksum = '0xfEc7B00DC0192319DdA0c777A9F04E47Dc49bD18';

    //claimContract.contract.functions

    //function calculateAddressString(address addr, bool includeAddrChecksum)
    const calcAddressResult = await this.cryptoSol.instance.methods.calculateAddressString(address, true).call();
    //0x66456337423030444330313932333139446441306337373741394630344534374463343962443138
    //this.log('calcAddressResult' + calcAddressResult);

    const buffer = Buffer.from(remove0x(calcAddressResult), 'hex');
    //this.log('buffer:' + buffer);
    const calcResult = buffer.toString('utf8');

    //this.log('calcResult:', calcResult);
    assert.equal(calcResult, addressWithChecksum, 'checksum must be calculated in a correct ways.');
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

    this.log("Buffer to sign:");
    this.log(buffer.toString('hex'));

    const hashResult = sha256.sha256(sha256.sha256(messageBuffer));
    this.log('HashResult: ' + hashResult);

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

    //this.log('running test on instance: ', this.instance);

    // test with PK: L3qEYQGUWwhFvkR13DCdqahwSfc4BJHXJamNKXGB2wm45JJjzJ58
    // https://tools.bitcoin.com/verify-message/

    const message = "0x70A830C7EffF19c9Dd81Db87107f5Ea5804cbb3F";
    const btcAddressbase58check = "1Q9G4T5rLaf4Rz39WpkwGVM7e2jMxD2yRj";
    const signatureBase64 = "IBHr8AT4TZrOQSohdQhZEJmv65ZYiPzHhkOxNaOpl1wKM/2FWpraeT8L9TaphHI1zt5bI3pkqxdWGcUoUw0/lTo="
    

    // Private: L4FkVsvM6FLuwJJHzpHJM6fUdG9acX5QqbvtvTSZRtG3Nsa7J8tv
    // Public : 02bee3163c5ba877f4205ab447fb42373bb1f77e898d0d649dc7c691a483551a37
    // PublicU: 04bee3163c5ba877f4205ab447fb42373bb1f77e898d0d649dc7c691a483551a378036be868fa5ec97c61b08073630c793ec550b77b28d96561ef9e89914b1e3a4


    //const hash = this.messageToHashToSign(message);
    //const hash = this.messageToHashToSign(message);

    const claimMessage =  await this.instance.methods.createClaimMessage(message, true).call();
    this.log('Claim Message:');
    this.log(claimMessage);

    //const hashResultSolidity = await this.instance.methods.getHashForClaimMessage(message, true).call();
    const hashResultSolidity = await this.instance.methods.calcHash256(claimMessage).call();
    this.log('hash Result Solidity:', hashResultSolidity);

    const hash = Buffer.from(hashResultSolidity, 'hex');

    this.log(`hash: ${hash.toString('hex')}`);

    const sig = this.cryptoJS.signatureBase64ToRSV(signatureBase64);
    
    const hashHex = '0x' + hash.toString('hex');
    const rHex  = '0x' + sig.r.toString('hex');
    const sHex =  '0x' + sig.s.toString('hex');

    //this.web3Instance.eth.ercRe
    //const ercRecoverResult27 = ecrecover(hash, 27, sig.r, sig.s);
    //this.log('js ercRecoverResult27: (public key) ' + ercRecoverResult27.toString('hex'));

    //const ercRecoverResult28 = ecrecover(hash, 28, sig.r, sig.s);
    //this.log('js ercRecoverResult28: (public key) ' + ercRecoverResult28.toString('hex'));

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


    // this.log('Recovered Address from solidity:');
    // this.log('27: ' + checkSignatureResult27);
    // this.log('28: ' + checkSignatureResult28);

    
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

    this.log('xy27: ', xy27);
    this.log('xy28: ', xy28);

    const result27 = await this.instance.methods.claimMessageMatchesSignature(message, true, xy27.x, xy27.y, 27, rHex, sHex).call();
    const result28 = await this.instance.methods.claimMessageMatchesSignature(message,true, xy28.x, xy28.y, 28, rHex, sHex).call();

    this.log('result27: ', result27);
    this.log('result28: ', result28);
  }

  public testBitcoinSignAndRecovery() {

    var keyPair = bitcoin.ECPair.fromWIF('5KYZdUEo39z3FPrtuX2QbbwGnNP5zTd7yyr2SC1j299sBCnWjss');
    
    var privateKey = keyPair.privateKey;
    var message = 'This is an example of a signed message.';
 
    var signature = bitcoinMessage.sign(message, privateKey, keyPair.compressed);
    this.log(signature.toString('base64'));

    var signature = bitcoinMessage.sign(message, privateKey, keyPair.compressed, { segwitType: 'p2sh(p2wpkh)' });
    this.log(signature.toString('base64'));

  }

  public testBitcoinMessageJS() {

    const privateKeyWid = 'L3qEYQGUWwhFvkR13DCdqahwSfc4BJHXJamNKXGB2wm45JJjzJ58';
    const address = '1Q9G4T5rLaf4Rz39WpkwGVM7e2jMxD2yRj';
    const message = '0x70A830C7EffF19c9Dd81Db87107f5Ea5804cbb3F';

    var keyPair = bitcoin.ECPair.fromWIF(privateKeyWid);
    var privateKey = keyPair.privateKey;

    var signature = bitcoinMessage.sign(message, privateKey, keyPair.compressed);
    this.log('signature: ', signature.toString('base64'));

    //var publicKey = keyPair.publicKey.toString('hex');
    //var signature = bitcoinMessage.
    //this.log(signature.toString('base64'))
    const verifyResult = bitcoinMessage.verify(message, address, signature);
    this.log('verifyResult = ', verifyResult);
    expect(verifyResult).to.be.equal(true);
  }

  private getBitcoinSignedMessageMagic(message: string) {

    const messagePrefix = '\u0018Bitcoin Signed Message:\n';
    const messagePrefixBuffer = Buffer.from(messagePrefix, 'utf8');;
    const messageBuffer = Buffer.from(message, 'utf8');
    const messageVISize = varuint.encodingLength(message.length);

    const buffer = Buffer.allocUnsafe(
      messagePrefix.length + messageVISize + message.length
    );

    messagePrefixBuffer.copy(buffer, 0);
    varuint.encode(message.length, buffer, messagePrefix.length);
    messageBuffer.copy(buffer, messagePrefix.length + messageVISize);
    return buffer;
  }

  public async testMessageMagicHexIsCorrect() {
    //compares the result of a JS implementation with the Solidity implementation
    //of handling the raw message with the magic values around it.
    const address = '0x70A830C7EffF19c9Dd81Db87107f5Ea5804cbb3F';
    const resultJS = '0x' + this.getBitcoinSignedMessageMagic(address).toString('hex');
    const resultSol = await this.cryptoSol.addressToClaimMessage(address);
    expect(resultSol).to.be.equal(resultJS);
  }

  public async testPubKeyToEthAddress() {

    // BIP39 Mnemonic: hello slim hope
    // address 0: 0x7af37454aCaB6dB76c11bd33C94ED7C0b7A60B2a
    // Public:    0x03ff2e6a372d6beec3b02556971bfc87b9fb2d7e27fe99398c11693571080310d8
    // Private:   0xc99dd56045c449952e16388925455cc32e4eb180f2a9c3d2afd587aaf1cceda5
    
    const expectedAddress = '0x7af37454aCaB6dB76c11bd33C94ED7C0b7A60B2a';
    const inputPrivateKey = 'c99dd56045c449952e16388925455cc32e4eb180f2a9c3d2afd587aaf1cceda5';

    var ec = new EC.ec('secp256k1');
    var G = ec.g; // Generator point
    var pk = new BN(inputPrivateKey, 'hex'); // private key as big number
    var pubPoint=G.mul(pk); // EC multiplication to determine public point 

    var x = pubPoint.getX().toBuffer(); //32 bit x co-ordinate of public point 
    var y = pubPoint.getY().toBuffer(); //32 bit y co-ordinate of public point 
    var publicKey =Buffer.concat([x,y])
    this.log("pub key::"+publicKey.toString('hex'))
  
    const result = await this.cryptoSol.pubKeyToEthAddress(x, y);
    this.log('pubKeyToEthAddress:', result);
    assert.equal(expectedAddress, result);
  }

  public async testMessageHashIsCorrect() {
    //compares the result of a JS implementation of the Bitcoin 
    const message = '0x70A830C7EffF19c9Dd81Db87107f5Ea5804cbb3F';
    var hash = '0x' + bitcoinMessage.magicHash(message).toString('hex');
    this.log('Bitcoin Hash: ', hash);
    const hashFromSolidity = await this.instance.methods.getHashForClaimMessage(message, true).call();
    this.log('hashFromSolidity', hashFromSolidity);
    expect(hash).to.be.equal(hashFromSolidity);
  }

  public async testSignatureToXY() 
  {
    //https://royalforkblog.github.io/2014/08/11/graphical-address-generator/
    //passphrase: bit.diamonds

    const message = "0x70A830C7EffF19c9Dd81Db87107f5Ea5804cbb3F";
    const signatureBase64 = "IBHr8AT4TZrOQSohdQhZEJmv65ZYiPzHhkOxNaOpl1wKM/2FWpraeT8L9TaphHI1zt5bI3pkqxdWGcUoUw0/lTo=";
    const key = this.cryptoJS.getPublicKeyFromSignature(signatureBase64, message);

    expect(key.x).equal("5EF44A6382FABDCB62425D68A0C61998881A1417B9ED068513310DBAE8C61040".toLowerCase());
    expect(key.y).equal("99523EB43291A1067FA819AA5A74F30810B19D15F6EDC19C9D8AA525B0F6C683".toLowerCase());
    expect(key.publicKey).equal("035EF44A6382FABDCB62425D68A0C61998881A1417B9ED068513310DBAE8C61040".toLowerCase());
  }




  public async testSignatureToXYMulti() 
  {
    // same test than in testSignatureToXYMulti
    // But with multi signatures of the same key.
    // in order to cover different signatures variations,
    // like short S and short R

    //https://royalforkblog.github.io/2014/08/11/graphical-address-generator/
    //passphrase: bit.diamonds

    //signatures created with: https://reinproject.org/bitcoin-signature-tool/#sign


    const message = "0x70A830C7EffF19c9Dd81Db87107f5Ea5804cbb3F";
    const signaturesBase64 = this.getTestSignatures();

    for (let index = 0; index < signaturesBase64.length; index++) {
      const signatureBase64 = signaturesBase64[index];
      const key = this.cryptoJS.getPublicKeyFromSignature(signatureBase64, message);
      expect(key.x).equal("5EF44A6382FABDCB62425D68A0C61998881A1417B9ED068513310DBAE8C61040".toLowerCase());
      expect(key.y).equal("99523EB43291A1067FA819AA5A74F30810B19D15F6EDC19C9D8AA525B0F6C683".toLowerCase());
      expect(key.publicKey).equal("035EF44A6382FABDCB62425D68A0C61998881A1417B9ED068513310DBAE8C61040".toLowerCase());
    }

  }

  public async testSolECRecover()
  {

    // same test than in testSignatureToXYMulti
    // But with multi signatures of the same key.
    // in order to cover different signatures variations,
    // like short S and short R

    // with this tool, we can create a Bitcoin address from a passphrase, 
    // also knowing X and Y. 

    // https://royalforkblog.github.io/2014/08/11/graphical-address-generator/
    // passphrase: bit.diamonds

    // and with this tool we can create the equivalent Ethereum Address, 
    // with the same X and Y then the Bitcoin ist.

    // https://www.royalfork.org/2017/12/10/eth-graphical-address/
    // passphrase: bit.diamonds

    const expectedEthAddress = '0xA5956975DE8711DFcc82DE5f8F5d151c41556656';
    const message = "0x70A830C7EffF19c9Dd81Db87107f5Ea5804cbb3F";

    // there for we can make a EC Recover on a bitcoin signed message and 
    // compare it with the Ethereum Signed Message

    const signaturesBase64 = this.getTestSignatures();

    for (let index = 0; index < signaturesBase64.length; index++) {

      const signatureBase64 = this.getTestSignatures()[0];
      const rs = this.cryptoJS.signatureBase64ToRSV(signatureBase64);
      const recoveredETHAddress = await this.cryptoSol.getEthAddressFromSignature(message, true, '0x1b', rs.r, rs.s);
      const recoveredETHAddress2 = await this.cryptoSol.getEthAddressFromSignature(message, true, '0x1c', rs.r, rs.s);

      this.log('recovered: ', recoveredETHAddress);
      this.log('recovered: ', recoveredETHAddress2);

      expect(expectedEthAddress).to.be.oneOf( [recoveredETHAddress ,recoveredETHAddress2] ); // on equal(expectedEthAddress);

    }
  }

  public async testPublicKeyToDMDAddress() {

    // https://royalforkblog.github.io/2014/08/11/graphical-address-generator/
    // passphrase: bit.diamonds
    const publicKeyHex = '035EF44A6382FABDCB62425D68A0C61998881A1417B9ED068513310DBAE8C61040';
    const expectedAddress = '1Q9G4T5rLaf4Rz39WpkwGVM7e2jMxD2yRj';    
   
    const { x, y } = this.cryptoJS.getXYfromPublicKeyHex(publicKeyHex);
    const bs58Result = await this.cryptoSol.publicKeyToBitcoinAddress(x, y, '00');
    
    assert.equal(expectedAddress, bs58Result);

  }

  public async testSignatureVerificationInContract() {

    const address = "1Q9G4T5rLaf4Rz39WpkwGVM7e2jMxD2yRj";
    const claimToAddress = "0x70A830C7EffF19c9Dd81Db87107f5Ea5804cbb3F";
    //const signatureBase64 = "IBHr8AT4TZrOQSohdQhZEJmv65ZYiPzHhkOxNaOpl1wKM/2FWpraeT8L9TaphHI1zt5bI3pkqxdWGcUoUw0/lTo=";
    const signatureBase64 = this.getTestSignatures()[0];

    const key = this.cryptoJS.getPublicKeyFromSignature(signatureBase64, claimToAddress);
    const rs = this.cryptoJS.signatureBase64ToRSV(signatureBase64);

    this.log('got public key X from signature:', key.x);

    const txResult1 = await this.cryptoSol.claimMessageMatchesSignature(claimToAddress, true, key.x, key.y, '0x1b', rs.r.toString('hex'), rs.s.toString('hex'));
    const txResult2 = await this.cryptoSol.claimMessageMatchesSignature(claimToAddress, true, key.x, key.y, '0x1c', rs.r.toString('hex'), rs.s.toString('hex'));

    expect(txResult1 || txResult2).to.be.equal(true, "Claim message did not match the signature");
    //this.log('Soldity Result: ', txResult);
  }
}