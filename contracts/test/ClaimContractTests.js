

var TestFunctions = require('../api/js/testFunctions');
var CryptoSol = require('../api/js/src/cryptoSol');
var CryptoJS = require('../api/js/src/cryptoJS');

var EC = require('elliptic').ec;
var BN = require('bn.js');
var ec = new EC('secp256k1');
var bs58check = require('bs58check');

//const { default: cryptoJS } = require('../api/js/cryptoJS');

const ClaimContract = artifacts.require('ClaimContract');

function remove0x(input) {
  if (input.startsWith('0x')) {
    return input.substring(2);
  }
  return input;
}

function hexToBuf(input) {
  return Buffer.from(remove0x(input), 'hex');
}

// appends a prefix to inputBuffer.
function prefixBuf(inputBuffer, prefixHexString) {
  const prefix = hexToBuf(prefixHexString);
  return Buffer.concat([prefix, inputBuffer]);
}

contract('ClaimContract', (accounts) => {
  console.log(`Accounts: ${accounts}`);

  // ClaimContract.deployed()
  //   .then(instance => instance.testECRecover.call(accounts[0]))
  //   .then(retrievedAccount => console.log('Account: ' + retrievedAccount))
  let claimContract;

  const callParams = {from: accounts[0]};

  let testFunctions;
  let cryptoSol;

  // console.error('Type of CryptoJS', typeof CryptoJS);
  // console.error('Type of CryptoJS', CryptoJS);
  // console.error('Type of CryptoJS.CryptoJS', typeof  CryptoJS.CryptoJS);
  let cryptoJS = new CryptoJS.CryptoJS();

  it('deploying a new claim contract', async () => {
    claimContract = await ClaimContract.new(callParams);
    testFunctions = new TestFunctions.TestFunctions(web3, claimContract.contract);
    cryptoSol = new CryptoSol.CryptoSol(web3, claimContract.contract);
  })

  // it('Verify address', async () => {
  //   let isValid = await claimContract.isValid.call(callParams);
  //   assert.isOk(isValid, "ERC Recover failed");
  //   //console.log('address: ' + address);
  // })

  it('correct Address checksum.', async() => {

    const address = '0xfec7b00dc0192319dda0c777a9f04e47dc49bd18';
    const addressWithChecksum = '0xfEc7B00DC0192319DdA0c777A9F04E47Dc49bD18';

    //claimContract.contract.functions

    //function calculateAddressString(address addr, bool includeAddrChecksum)
    const calcAddressResult = await claimContract.contract.methods.calculateAddressString(address, true).call();
    //0x66456337423030444330313932333139446441306337373741394630344534374463343962443138
    console.log('calcAddressResult' + calcAddressResult);

    const buffer = Buffer.from(remove0x(calcAddressResult), 'hex');
    console.log('buffer:' + buffer);
    const calcResult = buffer.toString('utf8');

    console.log('calcResult:', calcResult);
    assert.equal(calcResult, addressWithChecksum, 'checksum must be calculated in a correct ways.');
  })

  it('addressToClaimMessage delivers expected claimMessage.', async() => {

    const address = '0xb56c4974EB4CFC2B339B441a4Ae854FeBE2B6504';
    //todo: define the real expected result to make sure that this works.
    const expectedResult = '0x18426974636f696e205369676e6564204d6573736167653a0a28307862353663343937344542344346433242333339423434316134416538353446654245324236353034'
    const result = await cryptoSol.addressToClaimMessage(address);
    assert.equal(result, expectedResult);
    //console.log('claim Message: ', result);
  })


  it('PublicKey to EthereumAddress works is correct.', async() => {
    // BIP39 Mnemonic: hello slim hope
    // address 0: 0x7af37454aCaB6dB76c11bd33C94ED7C0b7A60B2a
    // Public:    0x03ff2e6a372d6beec3b02556971bfc87b9fb2d7e27fe99398c11693571080310d8
    // Private:   0xc99dd56045c449952e16388925455cc32e4eb180f2a9c3d2afd587aaf1cceda5

    const expectedAddress = '0x7af37454aCaB6dB76c11bd33C94ED7C0b7A60B2a';
    const inputPrivateKey = 'c99dd56045c449952e16388925455cc32e4eb180f2a9c3d2afd587aaf1cceda5';


    var G = ec.g; // Generator point
    var pk = new BN(inputPrivateKey, 'hex'); // private key as big number
    var pubPoint=G.mul(pk); // EC multiplication to determine public point 

    var x = pubPoint.getX().toBuffer(); //32 bit x co-ordinate of public point 
    var y = pubPoint.getY().toBuffer(); //32 bit y co-ordinate of public point 
    var publicKey =Buffer.concat([x,y])
    console.log("pub key::"+publicKey.toString('hex'))
  
    const result = await claimContract.contract.methods.pubKeyToEthAddress(x, y).call();
    console.log('pubKeyToEthAddress:', result);
    assert.equal(expectedAddress, result);
  })


  it ('dmdAddressToRipeResult returns correct value', async() =>{
    // http://royalforkblog.github.io/2014/08/11/graphical-address-generator/
    // passphrase: bit.diamonds

    const address = '1Q9G4T5rLaf4Rz39WpkwGVM7e2jMxD2yRj';
    const expectedRipeResult = 'FDDACAAF7D90A0D7FC90106C3A64ED6E3A2CF859'.toLowerCase();
    const realRipeResult = cryptoJS.dmdAddressToRipeResult(address).toString('hex');
    assert.equal(realRipeResult, expectedRipeResult);

  })


  // it('PublicKey to DMDAddress works correct.', async() => {
  //   // http://royalforkblog.github.io/2014/08/11/graphical-address-generator/
  //   // passphrase: bit.diamondsj
  //   const publicKeyHex = '035EF44A6382FABDCB62425D68A0C61998881A1417B9ED068513310DBAE8C61040';
  //   const expectedAddress = '1PQufB3ymB225SjbE9VS5GdraYDWNjftCk';

  //   //const inputPrivateKey = 'KyiQPTyCCbZVaWHFa8AbZLF5KbJtYANAigtpgeejC72CFJ6htuRv';

  //   // public key = k
  //   // x, y = ?
  //   //var EC = require('elliptic').ec;
    
  //   var ec = new EC('secp256k1');

  //   //var G = ec.g; // Generator point
  //   //var pubPoint=G.mul(pk); // EC multiplication to determine public point 
    
  //   var publicKey = ec.keyFromPublic(publicKeyHex.toLowerCase(), 'hex').getPublic();
  //   var x = publicKey.getX();
  //   var y = publicKey.getY();
  //   console.log("pub key:" + publicKey.toString('hex'));
  //   console.log("x :" + x.toString('hex'));
  //   console.log("y :" + y.toString('hex'));

  //   const legacyCompressedEnumValue = 1;
  
  //   const resultHex = await claimContract.contract.methods.PublicKeyToBitcoinAddress('0x' + x.toString('hex'), '0x' + y.toString('hex'), legacyCompressedEnumValue).call();
  //   console.log('PublicKeyToBitcoinAddress:', resultHex);
  //   let result = hexToBuf(resultHex);
  //   result = prefixBuf(result, '00');
  //   console.log('with prefix: ' + result.toString('hex'));
    
  //   const bs58Result = bs58check.encode(result);
  //   assert.equal(expectedAddress, bs58Result);
  // })

  // it('Retrieve Bitcoin address from signature', async() => {

  //   await testFunctions.testAddressRecovery();
  //   //let recoveredPublicKey = await claimContract.getPublicKeyFromBitcoinSignature.call(dmdSignature, addressToSign, callParams)
  //   //let recoveredAddress = await claimContract.getBitcoinAddressFromSignature.call(dmdSignature, addressToSign, callParams);
  // })

  // it('Retrieve Bitcoin address from signature', async() => {

  //   //await testFunctions.testBitcoinSignAndRecovery();
  //   //console.log('testFunctions: ', testFunctions);
  //   //console.log(testFunctions);
  //   await testFunctions.testAddressRecovery();
  //   //let recoveredPublicKey = await claimContract.getPublicKeyFromBitcoinSignature.call(dmdSignature, addressToSign, callParams)
  //   //let recoveredAddress = await claimContract.getBitcoinAddressFromSignature.call(dmdSignature, addressToSign, callParams);
  //   //console.log('recoveredAddress: ' + recoveredAddress);
  //   //assert.equal(dmdAddress, recoveredAddress, 'recovered address must be equal to expected address.');
  // })


})
