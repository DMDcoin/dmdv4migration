

var TestFunctions = require('../api/js/tests/testFunctions');
var CryptoSol = require('../api/js/src/cryptoSol');
var CryptoJS = require('../api/js/src/cryptoJS');

var EC = require('elliptic').ec;
var BN = require('bn.js');
var ec = new EC('secp256k1');


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

    await testFunctions.testMessageMagicHexIsCorrect();
    // const address = '0xb56c4974EB4CFC2B339B441a4Ae854FeBE2B6504';
    // //todo: define the real expected result to make sure that this works.
    // const expectedResult = '0x18426974636f696e205369676e6564204d6573736167653a0a28307862353663343937344542344346433242333339423434316134416538353446654245324236353034'
    // const result = await cryptoSol.addressToClaimMessage(address);
    // assert.equal(result, expectedResult);
    // //console.log('claim Message: ', result);
  })


  it('PublicKey to EthereumAddress works is correct. (testPubKeyToEthAddress)', async() => {
    
    await testFunctions.testPubKeyToEthAddress();
  })


  it ('function dmdAddressToRipeResult', async() =>{
    // https://royalforkblog.github.io/2014/08/11/graphical-address-generator/
    // passphrase: bit.diamonds

    const address = '1Q9G4T5rLaf4Rz39WpkwGVM7e2jMxD2yRj';
    const expectedRipeResult = 'FDDACAAF7D90A0D7FC90106C3A64ED6E3A2CF859'.toLowerCase();
    const realRipeResult = cryptoJS.dmdAddressToRipeResult(address).toString('hex');
    assert.equal(realRipeResult, expectedRipeResult);

  })


  it('contract function (PublicKey to DMDAddress) (testPublicKeyToDMDAddress)', async() => {
    await testFunctions.testPublicKeyToDMDAddress();
  })

  it('Test Signing and Verification with Bitcoin Tool: testBitcoinMessageJS', async() => {
    //minimal test if the version of BitcoinMessageJS works as expected.
    testFunctions.testBitcoinMessageJS();
  })

  it('testMagicHash', async() => {
    await testFunctions.testMessageHashIsCorrect();
  })




  it('Retrieve Public Key from signature (testSignatureToXY)', async() => {
    
    await testFunctions.testSignatureToXY();
  })

  it('Retrieve Public Key from multiple signatures (testSignatureToXYMulti)', async() => {
    
    await testFunctions.testSignatureToXYMulti();
  })
  
    // it('Retrieve Bitcoin address from signature', async() => {
    
  //    await testFunctions.testAddressRecovery();
  // })


  it('ECRecover from Contracts matches expected Etherem/Bitcoin pseudo address', async() => {
      await testFunctions.testSolECRecover();
  })


  it('Validating signature in solidity', async() => {
    await testFunctions.testSignatureVerificationInContract();
  })
  

})
