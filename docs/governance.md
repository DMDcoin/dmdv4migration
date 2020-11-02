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

### Voting

Validators are encouraged to vote early in order to display their opinion by voting for an option in a proposal.
Delegaters are encouraged to stake their funds on active validators,
that vote in their favor.
It is possible and welcomed to change this decision during the 14 day voting period,
but it is also very welcomed to explain why.
Validators are trusted by their delegators.
Delegators that feel betrayed by the promise of their Validators,
will switch to another validator.

### Timing

The system alternates between 2 phases:
* proposal phase
* voting phase

Both take 14 days.  
During the proposal phase, new ballots can be created.  
During the voting phase, validators can vote for or against open proposals.  
At the end of the voting phase, binding votes are executed in the order of their creation. All proposals are then considered as done, regardless of the voting outcome and of the the outcome of payout transactions.  
The new proposal phase always starts with 0 open proposals.

### Ballots creation
Voting Ballots are stored on the blockchain and contain a text,
an optional payout address and an optional payout amount.
Ballots with a zero amount, and a payout address can be used to trigger a smart contract function.

There is no minimum amount of voters required to accept a proposal.
Binding votes (those coming with a payout) require a majority of 2/3 in order to trigger the payment.
In the case of non-binding votes, no concept of majority exists (the UI should just show the result).

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
- voters are allowed to change their vote
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

PosDao does not include a DAO for funding pool management or for unbinded votings.


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


### Decret Politeia

Based on Bitcoin-tech. Too far away to get ported.



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

#### Option 1: aragon adaption of Voting.sol

A possible way would to adapt it would the to create a customized Voting.sol Logic: 
https://github.com/aragon/aragon-apps/blob/master/apps/voting/contracts/Voting.sol
There are not many references to the minime token.

On the other hand, those requirements are not solved:
- Voting must not be changeable
- Voting must be calculated at the end-time (currently voting seems to be calculated at the "begin-time" snapshot when the voting is created)
- Voting end time is HBBFT Epoch Switch


Concept of making the voting end-time-based, 
one option would be to remove the execute part of Voting.Sol

This could be achieved, doing the following changes:

- _executesIfDecided needs always to be set to false. (do a revert if it is "true" OR hardcode it to true -> hardcoding is more confusing, but other modules that do not offer an option to specify that, would be supported without additional changes.)
- _canExecute requires to check, if the vote has been updated to the end-time-based weights.

To update the Voting weights, there are several Implemtation strategies available:

##### Option 1.a: HBBFT-POSDAO Staking changes are updating the Vote.

This strategy would have the benefit that the UI displays always the current state in the YES/NO voting.

- Voting contract needs to know, what votings for this delegator/staker are open, and require to update them.
- HBBFT-POSDAO contracts need to update the voting result, if someone is moving the stake. , that would make things easier, since then we do not need to develop a snapshot history (TODO: check maybe Snapshot-History already exists ?)
- HBBFT-POSDAO could also Trigger an update of all Votings for a staker

##### Option 1.b: HBBFT-POSDAO Epoch changes updates and executes the Vote

This would lead to a solution where the Users see the yes/no Voting result, 
with the voting weights that has existed during the creation of the vote.

TODO: further analyse required changes.

##### Option 1.c: HBBFT-POSDAO Contracts support checkpointing.

TODO: Maybe already supported ?

most of all 2 functions:
```
function balanceOfAt(address _owner, uint256 _blockNumber) public view returns (uint256)
function totalSupplyAt(uint256 _blockNumber) public view returns (uint256);
```

This would allow the the Voting.sol to have an additonal function,
that retrieves the balance at the given block.

TODO: Figure out, how the Voting.sol can know, when the specific Epoch Ended. (TODO: Define Epoch End Time Calculation model)

The Voting requires then to be "finalized".
This finalisation step then updates the voting-weights and executes the vote if successfull.

#### Option 2: aragon voting connectors

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



#### aragon Voting: single delegation

There is a Issue about that topic and a Pull request available: 
https://github.com/aragon/aragon-apps/issues/623
https://github.com/aragon/aragon-apps/pull/881

Todo: Further investigation.

#### aragon FAQ

Q: Can i give away my REP during i have a Vote Open ? can the other one vote twice ?!
A: No problem there, the status is determined at the block when the vote is happening.

Q: Can this suppot the upgrade of HBBFT-POSDAO ?
A: Yes, a Vote can have an execution script, therefore it should be able to make an Update (POC would be nice)

### DAOStack Alchemy

Medium: https://medium.com/daostack/an-explanation-of-daostack-in-fairly-simple-terms-1956e26b374
Github: https://github.com/daostack/alchemy
example installation: https://alchemy.daostack.io/dao/0x519b70055af55a007110b4ff99b0ea33071c720a

TODO: Analyze Level of decentralisation,
higher level components seem to use centralized caching layers.

Maybe DMD could just include this caching layer in his RPC Standard definition ?
The experiences we made so far with ethereum was, that without a caching layer,
it is almost impossible to achieve fast responsive apps.
Since most DApps would use a centralized RPC anyway, we could just say that such a 
caching layer is a mandatory coexistance for DMD.

### compound governance


github: https://github.com/compound-finance/compound-protocol
medium: https://medium.com/compound-finance/compound-governance-5531f524cf68
