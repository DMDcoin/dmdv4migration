
//just a file that speeds up the testing routines for functions that don't require the blockchain.

import { CryptoJS } from '../src/cryptoJS';


const cryptoJS = new CryptoJS();

const signatureBase64 = "IBHr8AT4TZrOQSohdQhZEJmv65ZYiPzHhkOxNaOpl1wKM/2FWpraeT8L9TaphHI1zt5bI3pkqxdWGcUoUw0/lTo=";
const message = "0x70A830C7EffF19c9Dd81Db87107f5Ea5804cbb3F";

cryptoJS.getPublicKeyFromSignature(signatureBase64, message);