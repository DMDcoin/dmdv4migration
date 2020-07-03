
# Testdesign


## Basic Functions 

* Create Claim Message (createClaimMessage)
* Ethereum Address to string with checksum (1 test should fail, 1 test OK)
* Message to Hash (JS & Solidity implementation)
* Get Public Key of Signed Message (SOL)
* + Get X, Y Coordinate of public Key
* Get Bitcoin Adress from Signed Message


## Real Claim Scenarios

* Fill a Account is possible
* Fill a Account twice should not work





## Sample Test Message:
% echo -n "Test" | bx message-validate 1BqtNgMrDXnCek3cdDVSer4BK7knNTDTSR ILoOBJK9kVKsdUOnJPPoDtrDtRSQw2pyMo+2r5bdUlNkSLDZLqMs8h9mfDm/alZo3DK6rKvTO0xRPrl6DPDpEik=

message: "Test"
Key: 1BqtNgMrDXnCek3cdDVSer4BK7knNTDTSR
Signature: ILoOBJK9kVKsdUOnJPPoDtrDtRSQw2pyMo+2r5bdUlNkSLDZLqMs8h9mfDm/alZo3DK6rKvTO0xRPrl6DPDpEik=


## Signature

Public keys (in scripts) are given as 04 <x> <y> where x and y are 32 byte big-endian integers representing the coordinates of a point on the curve or in compressed form given as <sign> <x> where <sign> is 0x02 if y is even and 0x03 if y is odd.


https://bitcoin.stackexchange.com/questions/77191/what-is-the-maximum-size-of-a-der-encoded-ecdsa-signature
this describes the signature as well:


1-byte 0x30 Compound Object