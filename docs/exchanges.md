# Upgrade Strategy for exchanges

The upgrade from V3 to V4 involves some steps to take,
since it is an upgrade from a Bitcoin based Tech to an Ethereum based tech stack.
Depending on the philosophy, the backend and the count of users,
there are different possible strategies we have pointed out so far.
There might be more possible strategies, feel free to pull request ;-)

## Strategy 1: address by address Migration

With this strategy, the exchange process every single account

- create a new V4 address (Ethereum compatible)
- assigning the newly created V4 address to the account
- sending a claim message to the V4 network using the private key of the V3 address

This scenario seems to be very straight forward.
The problem behind that is that it requires a lot of automation,
especially the signing part is very likely only implemented in the DMD Wallet,
and not in the backend software usually used in exchanges.

## Strategy 2: manual address by address migration.

This strategy is address by address migration requiring a focused person,
but does not require much of coding.
This strategy might be handy for migrating a small amount of accounts,
and has to be invoked before the upgrade is happening.

for each account do:
- create new V3 address in the DMD Wallet. => tmpV3
- send the account funds to the DMD Wallet address.
- remember the account association.

now wait for the Upgrade to get accomplished.

for each account do:
- Create and remember a V4 Address for the account. => accountAddressV4
- Use the DMD Wallet and create a claim message using the tmpV3 address and sending it to the accountAddressV4
- Use the Claim Tool to send the claim message to the Network.


## Strategy 3: early bulk migration

This strategy differs from strategy 1,
as it uses the DMD Wallet application for signing the claim message,
instead of having to code this step.
However, it now includes more steps to automate, but they those are less complex.
But it needs to be invoked before the V3 Snapshot is taken.

- create a new V3 address, that will  hold all this funds, using the DMD Wallet => exchangeAddressV3

For each account do
- send all funds from the V3 address to the exchangeAddressV3.

Now do the following with that one account that holds all funds:

- wait for the Upgrade to be done.
- create an exchangeAddressV4. (ethereum compatible address)
- create a claim message with the DMD Wallet from the exchangeAddressV3 to the exchangeAddressV4.
- send this claim message to claim all funds in V4 using the provided claim tool.

Now, exchangeAddressV4 holds all funds,
and they need to get distributed back to the V4 address associated with the user account.
This is a standard operation again, and should be easy to be automated:

For each account do
- Create a new V4 address for the account and remember this association. => accountAddressV4
- Transfer the fund for this account from the exchangeAddressV4 to the corresponding accountAddressV4.


## Stategy 4: User centric migration

This scenario is best suited for exchange with a very very small amount of users.
It requires a critical mass of users to cooperate, inactive users might lose their values.
The strategy is very close to Strategy 2: manual address by address migration,
but it asks the user to withdraw their funds from the exchange
instead of having the exchange doing the work.

Each Users does:
- withdraw funds to the already used DMD Wallet address.

Now wait for the Upgrade to get accomplished.

Each Users does:
- Create a new V4 Address with the compatible tool of choice. (any Ethereum compatible address) addressV4
- Use the DMD Wallet and create a claim message for claiming the funds on addressV4
- Use the Claim Tool to send the claim message to the Network.