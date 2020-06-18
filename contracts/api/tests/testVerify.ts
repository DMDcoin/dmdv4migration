

//example address from bitcoin.
// Private: L4FkVsvM6FLuwJJHzpHJM6fUdG9acX5QqbvtvTSZRtG3Nsa7J8tv
// Public: 02bee3163c5ba877f4205ab447fb42373bb1f77e898d0d649dc7c691a483551a37
// Address: 1BzFQE9RWjNQEuN2pJTFEHN21LureERhKX


import RIPEMD160 from 'ripemd160'


const message = "0x70A830C7EffF19c9Dd81Db87107f5Ea5804cbb3F";
const signatureBase64 = "IHe2FvaAsIbIEvb47prSFg3rXNHlE91p2WYtpxIpPA30W6zgvzwc3wQ90nnA12LbL2aKo3a0jjgbN6xM7EOu/hE=";
const btcAddressBase64 = "1BzFQE9RWjNQEuN2pJTFEHN21LureERhKX";

const sig = Buffer.from(signatureBase64, 'base64');
const btcAddress = Buffer.from(btcAddressBase64, 'base64');



//r: 2077b616f680b086c812f6f8ee9ad2160deb5cd1e513dd69d9662da712293c0d
//s: f45bace0bf3c1cdf043dd279c0d762db2f668aa376b48e381b37ac4cec43aefe

const r = sig.subarray(0, 32);
const s = sig.subarray(32,64);
const v = sig[64];


console.log(`r: ${r.toString('hex')}`);
console.log(`s: ${s.toString('hex')}`);
console.log(`v: ${v}`);





function messageToHashToSign(message: string) {

  var buf = Buffer.from(message, 'utf8');
  console.log(buf)
  const ripe = new RIPEMD160();
  ripe.end(buf);

  
  //console.log(ripe.read().toString('hex'));

  const readResult =  ripe.read() as Buffer;
  console.log(readResult.toString('hex'));
  //console.log(readResult.length);

  // https://bitcoin.stackexchange.com/questions/36838/why-does-the-standard-bitcoin-message-signature-include-a-magic-prefix

  

  const bitcoinPrefixString = '\x18Bitcoin Signed Message:\n';
  const bitcoinPrefix = Buffer.from(bitcoinPrefixString, 'utf8');
  const messageSize = message.length;

  // source code from 
  // https://github.com/bitcoinjs/bitcoinjs-lib/blob/1079bf95c1095f7fb018f6e4757277d83b7b9d07/src/message.js#L13
  // function magicHash (message, network) {
  //   var messagePrefix = new Buffer(network.messagePrefix)
  //   var messageBuffer = new Buffer(message)
  //   var lengthBuffer = bufferutils.varIntBuffer(messageBuffer.length)
  //   var buffer = Buffer.concat([messagePrefix, lengthBuffer, messageBuffer])
  //   return crypto.hash256(buffer)
  // }

  const buffer = Buffer.alloc(bitcoinPrefix.byteLength + )

  
  //20 byte result

  //return crypto.hash256(buffer)
}
  

  
  


messageToHashToSign(message);