

# DMD Coin Migration from V3 to V4.

This project is about migrating from an DMD from a Bitcoin Based Version (v3) to an Ethereum Based Version (v4).

https://bit.diamonds
https://github.com/DMDcoin

# How ?

There will be no "Autotransfer" of the Coins from V3 to V4, since those are fundamentional different technologies.
The way it works is that on a defined point in time, there will be a Snapshot for V3 created, and the balance 
of the accounts during that snapshot will be stored on the V4 chain in a Smart Contract.
The Smart Contracts also holds a corresponding amount of coins in the V4 Network.
An owner of an V3 account still has his private key available, and still is able to sign messages using his private key.

The Smart contract on the other side is able to verify this signed message, and is therefore able to send out the funds to the specified contract.


# Step by Step


