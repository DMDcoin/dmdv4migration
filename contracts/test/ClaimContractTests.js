


const ClaimContract = artifacts.require('ClaimContract');



contract('ClaimContract', (accounts) => {
  console.log(`Accounts: ${accounts}`);

  // ClaimContract.deployed()
  //   .then(instance => instance.testECRecover.call(accounts[0]))
  //   .then(retrievedAccount => console.log('Account: ' + retrievedAccount))
  let claimContract;

  const callParams = {from: accounts[0]};

  it('deploying a new claim contract', async () => {
    claimContract = await ClaimContract.new(callParams);
  })

  it('Verify address', async () => {
    let address = await claimContract.testECRecover.call(callParams);
    console.log('address: ' + address);
  })
  
})
