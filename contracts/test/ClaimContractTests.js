

var TestFunctions = require('../api/js/testFunctions');
var CryptoSol = require('../api/js/src/cryptoSol');

const ClaimContract = artifacts.require('ClaimContract');

function remove0x(input) {
  if (input.startsWith('0x')) {
    return input.substring(2);
  }
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

  it('deploying a new claim contract', async () => {
    claimContract = await ClaimContract.new(callParams);
    
    testFunctions = new TestFunctions.TestFunctions(web3, claimContract.contract);
    // console.error('Type of CryptoJS', typeof CryptoJS);
    // console.error('Type of CryptoJS', CryptoJS);
    // console.error('Type of CryptoJS.CryptoJS', typeof  CryptoJS.CryptoJS);
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


  it('Retrieve Bitcoin address from signature', async() => {

    //await testFunctions.testBitcoinSignAndRecovery();
    //console.log('testFunctions: ', testFunctions);
    //console.log(testFunctions);
    await testFunctions.testAddressRecovery();
    //let recoveredPublicKey = await claimContract.getPublicKeyFromBitcoinSignature.call(dmdSignature, addressToSign, callParams)
    //let recoveredAddress = await claimContract.getBitcoinAddressFromSignature.call(dmdSignature, addressToSign, callParams);
    //console.log('recoveredAddress: ' + recoveredAddress);
    //assert.equal(dmdAddress, recoveredAddress, 'recovered address must be equal to expected address.');
  })


})
