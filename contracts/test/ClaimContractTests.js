

var TestFunctions = require('../api/js/testFunctions');


const ClaimContract = artifacts.require('ClaimContract');

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

  it('Retrieve Bitcoin address from signature', async() => {
    //console.log('testFunctions: ', testFunctions);
    //console.log(testFunctions);
    await testFunctions.testAddressRecovery();
    //let recoveredPublicKey = await claimContract.getPublicKeyFromBitcoinSignature.call(dmdSignature, addressToSign, callParams)
    //let recoveredAddress = await claimContract.getBitcoinAddressFromSignature.call(dmdSignature, addressToSign, callParams);
    //console.log('recoveredAddress: ' + recoveredAddress);
    //assert.equal(dmdAddress, recoveredAddress, 'recovered address must be equal to expected address.');
  })
})
