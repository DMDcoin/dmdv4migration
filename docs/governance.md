
# DRAFT

# DMD DAO Governance Design

This is a design draft for the DMD DAO Governance stack.
The DAO Governance design will be minimalistic and might grow over time.

The DAO Governance goes hand in hand with the POSDAO Contracts (TODO: insert link to Repo here),
meaning that every validator has voting rights.

## Blockchain Fork
Like in any other blockchain system, 
the consensus of the operators has the highest democratic, but most brutal force.
The goal of this governance system is, that this option will never be required.
But this possibility is still good as an emergency fallback.

## DMD Governance
The DMD Governance System is a [weighted voting](https://en.wikipedia.org/wiki/Weighted_voting) System that 
allows validators to vote for system changes and for maintenance pool payouts.
Delegators will support the decisions of the validators by staking on them.

### Delegator Voting
Delegators influence the voting by staking on a validator that decides in their sense.
A Delegator might change their Validator based on the likeness of their voting decisions.

### Voting Weight
The governance voting is a weighted voting process done by all validators.
Their voting weight is valued by the stake of their nodes.
This is an incentive for validators to attract more delegators on their nodes,
while being active in voting processes, and doing good and reasonable decisions in the voting process
is an incentive for delegators to give their voting power into the hands of validators,
that are active contributors driving the ecosystem forward.
The weight of the voting is determined at the end of the voting period.
TODO TECH: Figure out what is required withing the HBBFT smart contracts to enable this calculation.
Does a concept like event subscription exist ?

### Public transparency
All votings are public visible, transparent and comprehensible.

### Lock In
Validators are able to vote once, but they are not able to change their decision.
This enables delegators to switch to a validator that represent their opinion in time.
It also encourages validators to do their decision early, in order to attract further delegator.

### Ballots creation
Voting Ballots are stored on the blockchain and contain a text,
an optional payout address and an optional payout amount.
Ballots with a zero amount, and a payout address can be used to trigger a smart contract function.

If more than 50% of the voters accept a proposal, 
the proposal will be accepted.
There is no minimum amount of voters required to accept a proposal
There is a minimum timeframe for a ballot when it can get executed.

The Communication about the proposal will happen off-chain.

### Maintenance Pool Payout

A proposal can contain a payment target and amount in the native currency.
By passing a proposal, a payment from the pool to the specified address will be triggered.
If a Pool Payout would be a value bigger then the value available in the pool,
the Ballot stays unfinalized, and can be finalized when there is enough DMD in the pool.

### Proposal fee
The reading and analyzing of a proposal requires time and effort
from the validators. In order to protect the system from spam,
it is required to pay a proposal fee that goes into the 
maintenance pool.
The creation of new proposals is not limited to validators.
Everyone who is willing to pay the proposal fee is allowed to do so.

The value of the proposal fee has to be defined during the ongoing refinement process.

### Voting System Upgrade

Open Topic for now,
need to get more insights in the POSDAO contracts.


## Analysis of existing Solutions

There are already some existing solutions out there that might suit our needs.
The Goal is to minimize the efforts to find a solution.

The requirements in a nutshell
- binding voting and non-binding voting (non-binding voting could be done as zero amount voting)
- weighted voting (easy injection on the stake)
- weights require to be calculated at the execution of the vote.
- voters are not allowed to change their opinion once theiy have voted.
- upgrading of the HBBFT-POSDAO Contracts (or is this a hardfork ?)
- upgrading of the Governance DAO Contracts.

### POA Governance App

The UI for the POA Governance Ballots fulfills already a lot of the requirements.
The Validator Management Ballot.

The UI itself is based on the POA Governance Framework 

The Emission Funds Ballot is almost this minimal 

A benefit of this solution is that the DMD-Team also launched ARTIS,
and ARTIS also used this Governance Framework.


### POSDAO

after a first check of the POSDAO Contracts for Governance,
i could not find Voting related content.

### Colony.io

Colony IO Supports up and down voting and funds management.
It is also interconnected with a offchain centralized chat service to discuss the proposals.
Further investigations are needed to check the compatibility with the DMD requirements.


### Moloch DAO

had the concept of being very minimalistict in V1,
and became more complex in V2. 
It is still one of the smallest DAO Frameworks available.
https://medium.com/metacartel/molochdao-a-primitive-solution-d11cc522b18e


### democracy.earth

Fork of MolochDAO
The quatratic voting extension is optional.
Need to analyse what are the differences to MolochDAO

### OracleDAO (Augur)

Another MolochDAO fork (pretty new)
Seems to use Weighted Voting as well.
But is a "Pay Tribute to enter" DAO.

Planning Paper: https://hackmd.io/@oracle-dao/Sk-uHkX78
Link: https://pokemol.com/dao/0x67b67c5b7384d6c1cdad1ed988b49183f4c59740/

### Aragon

Complex and flexible solution for Blockchain Governance.
Since it's huge compelexity with modular design,
it might take severel days, just to answer the question if suits or not.

a good hint could be the Repution Template: 
https://github.com/aragon/dao-templates/blob/master/templates/reputation/contracts/ReputationTemplate.sol

dependency to ENS

### dao.care

small project, not that fancy UI - currently lacking a lot of informations.
also cross-connected with 3Box to avoid anonymity.
However, it is in Beta - and under active development. 
this judgement was based on the published version on https://dao.care/
is this based on aave ??


### aragon

created testinstance for aragon on rinkeby with 

* company template  https://rinkeby.aragon.org/#/dmdcompany/ (Token DMDVote: 0x8c39006b8d349a28fba0f6555b048232b3a4722b)
* reputation template https://rinkeby.aragon.org/#/dmdreputation/ (Token DMD Reputation: 0xdfeae13f6d72889ea2dd7e067c20e33aa0c009c1)
* enterprise template https://rinkeby.aragon.org/#/dmdenterprise

For the Company Installation i used Treshold 66%. 
I was curious if there is a possibility to change that treshold. There is a Permission, but i could not find UI Support.
Maybe that's only doable using the API direct ?!

Decentraland is also a great example for a big project using aragon with a custom modules:

https://mainnet.aragon.org/#/dcl.eth/0x41e83d829459f99bf4ee2e26d0d79748fb16b94f/vote/3/

#### aragon adaption of Voting.sol (Option 1)

A possible way would to adapt it would the to create a customized Voting.sol Logic: 
https://github.com/aragon/aragon-apps/blob/master/apps/voting/contracts/Voting.sol
There are not many references to the minime token.

On the other hand, those requirements are not solved:
- Voting must not be changeable
- Voting must be calculated at the end-time (currently voting seems to be calculated at the "begin-time" snapshot when the voting is created)
- Voting end time is HBBFT Epoch Switch


#### aragon voting connectors (Option 2)

This adaption would require keeping history of the balance of the voting power of a
staker and/or delegator.

```
// See shared/contract-utils/contracts/interfaces/IERC20WithCheckpointing.sol
contract IERC20WithCheckpointing {
    function balanceOf(address _owner) public view returns (uint256);
    function balanceOfAt(address _owner, uint256 _blockNumber) public view returns (uint256);

    function totalSupply() public view returns (uint256);
    function totalSupplyAt(uint256 _blockNumber) public view returns (uint256);
}
```
https://github.com/aragonone/voting-connectors

####  aragon stakin app ERC900: Simple Staking Interface (Option 3)

ERC900 is a standard for Staking Contract interfaces as well.
There is a Pull Request to support that.
https://github.com/aragon/aragon-apps/pull/101

What happened with it ?

Implement this interface?
https://github.com/aragonone/voting-connectors/blob/master/apps/voting-aggregator/contracts/interfaces/IERC900History.sol



#### aragon FAQ

FAQ:
Q: Can i give away my REP during i have a Vote Open ? can the other one vote twice ?!
A: No, the status during the 

FAQ:
Q: Can this suppot the upgrade of HBBFT-POSDAO ?
A: Looks not like this is the case out of the box.
However, since other modules are hooking in modules for supporting 




