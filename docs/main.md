

# DMD Coin Migration from V3 to V4.

This project is about migrating from an DMD from a Bitcoin Based Version (v3) to an Ethereum Based Version (v4).

https://bit.diamonds
https://github.com/DMDcoin

# How ?
There will be no "Autotransfer" of the Coins from V3 to V4, since those are fundamental different technologies.
This means, that all your funds on the new chain(V4) will be transferred to a new account, chosen by the owner of the private key of the address with a coin balance on snapshot date on old chain (V3).

The way it works is that on a defined point in time, there will be a Snapshot of V3 created, and the balance 
of the accounts during that snapshot will be stored on the V4 chain in a Smart Contract.
The Smart Contracts also holds a corresponding amount of coins in the V4 Network.
An owner of an V3 address still has his private key available, and is still able to sign messages using his private key.

For that reason of sign messages to claim coins on V4 chain people must keep their old DMD Diamond V3 Wallet and the wallet.dat that hald the keys for their addresses with balance.

The Smart contract on the V4 side is able to verify this signed message, and is therefore able to send out the funds to the specified contract.
Therefore, it needs to know the following:

- Address on the V3 Network.
- Balance for that address.

## Dust Accounts

Note: only addresses with a balance bigger than a certain threshold (planned: 1 DMD) will get picked up during this V4 network upgrade.
The smaller addresses are considered "Dust" addresses, not worth the effort to claim it on the new chain.
We suggest to transfer smaller amounts to one address, so you do not lose this money.
This has to be done before the network upgrade happens.

be aware of the bitcoin type of wallet behavior of "change addresses" which means any change of a transaction is placed on a new address. this means even if u think u only created and use 1 address ur funds could be spread over multiple addresses if u had some outgoing transactions with a change ammount send back to a new address. your wallet.dat hold the keys for that change addresses too so as long as u have a backup of ur wallet.dat u will be able to claim them BUT a simple backup of a private key will only be able claim coins on that one address

# Step by Step (Network perspective)

##

first of all we strong suggest u move ur coins into a DMD Diamond v3 wallet pre snapshot date so u dont deepend on any 3rd party to be able claim ur coins

exchanges
coinmarketcap
community
all known player in DMD Diamond ecosystem
will be informed about snapshot blocknumber and expected date it will happen

they have 2 options
inform users a few weeks upfront to withdraw at latest 1 week pre snapshot and stop supporting the DMD Diamond Network from that point on

or take part in the DMD v3 to v4 migration and convert customer funds by themself into the new v4 coins by claiming them

in that case we suggest to stop allow deposit and withdraws 7 days upfront of snapshot date
and reopen deposit and withdraws with the new address schema 7 days after claiming the coins on new DMD Diamond v4 chain

## Snapshot

a blocknumber will be announced for snapshot of DMD Diamond V3 balance snapshot.
on that blocknumber a state of what address owns what ammount of DMD will be taken and be used as base of claim coins smartcontract in DMD Diamond V4

## stop of support of DMD Diamond V3 network

after snapshot DMD v3 runs into out of support state

DMD Diamond coinshortsign exchange listings and general all activities that mention DMD Diamond from that time on will be regarding the V4 version

yes there might be some nodes not upgrading still running v3 nodes but same as there still some bitcoin nodes run software a few years outdated they cant generate any real DMD that can be traded or have value

anything that happens on V3 network after snapshot have no real importance or impact as its unclaimable funds in v4

only snapshot balance is relevant

## Migration

Snapshot is used as information source for creating the genesis block in V4.
This will take a while. During that preparation time, no Node is online.

## Bootstraping

After that, the Genesis Block and the Chain Specification is ready and DMDv4 can be started with a initial validator set of 12 nodes
this 12 nodes are well knows foundation and high trusted community members which are the only onces who get their funds distributed direct at genesis block and not via claiming tool later on

the reason is that the network need validators to create blocks from start on

and the claiming tool need a running chain to be deployed and used by people

funds that this 12 initial validators own at snapshot will be not included into the claimtool contracts so they dont get their coins twice

its a volunteer job to help get chain started without any advantage later on as they will follow the same honeybadger/posdao ruleset that select validators for new epoches

we expect the phase where only initial validators create blocks and not many people did claim coins and set up validators just a few hours max a few days so there is no relevant advantage in earning blockrewards to be feared


## HoneyBadger DPOS Takeoff

After this initial Bootstrapping phase new Nodes take over now the new operation of the network using the new Honeybadger-DPOS Consensus.

DMDv4 is now public, online, and available for operation and ready to pick up further DPOS nodes.
Fund owners now can claim their belongings by using the provided DApp or  for the purists - directly interact with the smart contract.
After claiming their funds, now everyone with enough stake is eligible to start running their own node.




@thomas im missing some explaination of the smart contract layout the gui components of the dapp and so on for didi to review
