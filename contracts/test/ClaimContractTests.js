

var TestFunctions = require('../api/js/testFunctions');


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

  it('deploying a new claim contract', async () => {
    claimContract = await ClaimContract.new(callParams);
    console.log('');
    testFunctions = new TestFunctions.TestFunctions(web3, claimContract.contract);
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
