


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
    let isValid = await claimContract.isValid.call(callParams);
    assert.isOk(isValid, "ERC Recover failed");

    //console.log('address: ' + address);
  })


  it('Retrieve Bitcoin address from signature', async() => {

    let addressToSign = '0x70A830C7EffF19c9Dd81Db87107f5Ea5804cbb3F';
    let dmdAddress = 'dR9uN3GXDikmiipy3p8L9fJ4pzCiHYfcrz';
    let dmdSignature = 'IIJrgH2LVfla214fObfGHMvEVxmEMtZjXK9fCT/3PWpnYSzGS0AZWzXDhGKt9wjX6Z6V0qS1gFNE7RZeUSD61CU=';
    let recoveredAddress = await claimContract.getBitcoinAddressFromSignature.call(dmdSignature, addressToSign, callParams);
    console.log('recoveredAddress: ' + recoveredAddress);
    assert.equal(dmdAddress, recoveredAddress, 'recovered address must be equal to expected address.');
  })


  
})
