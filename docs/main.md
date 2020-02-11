

# DMD Coin Migration from V3 to V4.

This project is about migrating from an DMD from a Bitcoin Based Version (v3) to an Ethereum Based Version (v4).

https://bit.diamonds
https://github.com/DMDcoin

# How ?
There will be no "Autotransfer" of the Coins from V3 to V4, since those are fundamental different technologies.
This means, that all funds on the Ethereum Side (V4) will be transferred to a new account, chosen by the owner of the private key of the Bitcoin side (V3).

The way it works is that on a defined point in time, there will be a Snapshot of V3 created, and the balance 
of the accounts during that snapshot will be stored on the V4 chain in a Smart Contract.
The Smart Contracts also holds a corresponding amount of coins in the V4 Network.
An owner of an V3 account still has his private key available, and is still able to sign messages using his private key.

The Smart contract on the V4 side is able to verify this signed message, and is therefore able to send out the funds to the specified contract.
Therefore, it needs to know the following:

- Address on the V3 Network.
- Balance for that address.

## Dust Accounts

Note: only addresses with a balance bigger than a certain threshold (planned: 1 DMD) will get picked up during this V4 network upgrade.
The smaller accounts are considered "Dust" Accounts, not worth the effort to claim it on the new chain.
We suggest to transfer smaller amounts to one account, so you do not lose this money.
This has to be done before the network upgrade happens.

# Step by Step (Network perspective)

## Shut down of the existing network
V3 will continue to operate until the planned transfer is happening.
TODO: Define what happens with V3.
Options:
- Hard Shutdown
- Keep V3 running for some time (make it readable?) , but don't accept new transactions (benefits?? it is still readable because of Blockchain explorers ?, is that easy possible ?)

## Snapshot

After freezing V3, the state of V3 has to be snapped so it is possible to launch V4 with the balances made in V3.

## Migration

During the migration phase, V3 is shutdown or frozen, and V4 is not started yet.
We try to mike this gap in time as small as possible,
but we need it for starting V4 with the correct amounts in the smart contract.
This has to be done this way to prevent frauds.
This Snapshot is used as information source for creating the genesis block in V4.
This will take a while. During that preparation time, no Node is online.

## Bootstraping

After that, the Genesis Block and the Chain Specification is ready and DMDv4 can be started with a single Node Configuration for the first blocks (TODO: define value of "first blocks" = ~ 100 ?).
(TODO: Find best way to configure this within Parity, maybe even a '1 out of 1 Honeybadger' ?)

The Blockreward for this first blocks will be 0, as well as the gas fees.
During that period, the transactions for retrieving the funds of the first Node Operators will get send into the system by the core team.
This is required to be able to switch the network to its final consensus: HoneyBadger - DPOS.

During this Bootstrapping phase, the Smart Contracts for the DPOS System will be deployed as well. (TODO: it might make sense to deploy it in the Genesis Block ?)
The Initial set of DPOS Validators (The Node operators of the core team) need to apply as Validators during that phase.

## HoneyBadger DPOS Takeoff

After this initial Bootstrapping phase, the core team should now have been claimed their funds and registered their DPOS nodes and having the Nodes already online with the configuration provided after the migration phase.
The new Nodes take over now the new operation of the network using the new Honeybadger-DPOS Consensus.

DMDv4 is now public, online, and available for operation and ready to pick up further DPOS nodes.
Fund owners now can claim their belongings by using the provided DApp or  for the purists - directly interact with the smart contract.
After claiming their funds, now everyone with enough stake is eligible to start running their own node.