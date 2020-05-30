
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


### POA Governance App

The UI for the POA Governance Ballots fulfills already a lot of the requirements.
The Validator Management Ballot.

The UI itself is based on the POA Governance Framework 

The Emission Funds Ballot is almost this minimal 

A benefit of this solution is that the DMD-Team also launched ARTIS,
and ARTIS also used this Governance Framework.


### POSDAO

Further check the POSDAO Contracts for Governance Content.

### Colony.io

Colony IO Supports up and down voting and funds management.
It is also interconnected with a offchain centralized chat service to discuss the proposals.
Further investigations are needed to check the compatibility with the DMD requirements.

### democracy.earth

Looks promising, need to take a deeper look.