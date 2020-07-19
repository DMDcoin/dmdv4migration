"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var js_sha256_1 = __importDefault(require("js-sha256"));
var bitcoinjs_message_1 = __importDefault(require("bitcoinjs-message"));
var bitcoinjs_lib_1 = __importDefault(require("bitcoinjs-lib"));
var cryptoJS_1 = __importDefault(require("./cryptoJS"));
var elliptic_1 = __importDefault(require("elliptic"));
//var ec = new EC('secp256k1');
var TestFunctions = /** @class */ (function () {
    function TestFunctions(web3Instance, instance) {
        this.web3Instance = web3Instance;
        this.instance = instance;
        this.cryptoJS = new cryptoJS_1["default"]();
        if (instance === undefined || instance === null) {
            throw Error("Claim contract must be defined!!");
        }
    }
    // public async testValidateSignature() {
    //   //let addressToSign = '0x70A830C7EffF19c9Dd81Db87107f5Ea5804cbb3F';
    //   //let dmdAddress = 'dR9uN3GXDikmiipy3p8L9fJ4pzCiHYfcrz';
    //   //signature seems to be encoded base64 instead of base58.
    //   //let dmdSignature = 'IIJrgH2LVfla214fObfGHMvEVxmEMtZjXK9fCT/3PWpnYSzGS0AZWzXDhGKt9wjX6Z6V0qS1gFNE7RZeUSD61CU=';
    //   const addressToSign = "0x70A830C7EffF19c9Dd81Db87107f5Ea5804cbb3F";
    //   const btcSignature = "IHe2FvaAsIbIEvb47prSFg3rXNHlE91p2WYtpxIpPA30W6zgvzwc3wQ90nnA12LbL2aKo3a0jjgbN6xM7EOu/hE=";
    //   const btcAddress = "1BzFQE9RWjNQEuN2pJTFEHN21LureERhKX";
    //   const signature = btcSignature;
    //   let sig = new Buffer(signature, 'base64');
    //   //console.log('Length: ' + dmdSignatureBuffer.length);
    //   //130 chars = 65 bytes => R, S, V.
    //   //let dmdSignatureHex2 = '20826b807d8b55f95adb5e1f39b7c61ccbc457198432d6635caf5f093ff73d6a67612cc64b40195b35c38462adf708d7e99e95d2a4b5805344ed165e5120fad425';
    //   //let dmdSignatureHex = '20826b807d8b55f95adb5e1f39b7c61ccbc457198432d6635caf5f093ff73d6a67612cc64b40195b35c38462adf708d7e99e95d2a4b5805344ed165e5120fad425';
    //   if (sig.byteLength != 65) {
    //     throw Error("Expected length of 65. got: " + sig.byteLength);
    //   }
    //   console.log(sig);
    //   let v = Array.from(sig.slice(0, 1));
    //   let r = Array.from( sig.slice(1, 33));
    //   let s = Array.from(sig.slice(33, 65));
    //   console.log('r', r);
    //   console.log('s', s);
    //   console.log('v', v);
    //   //console.log(bitcore.fromString);
    //   // const pubKeyResult = await this.instance.methods.getPublicKeyFromBitcoinSignature(hashOfSignedInfo, r, s, v[0]).call();
    //   // console.log('PublicKey:' + pubKeyResult);
    //   // return pubKeyResult;
    //   const hashOfSignedInfo = "";
    // };
    //Ethereum Address to string with checksum
    TestFunctions.prototype.runTestEthereumAddressToStringWithChecksum = function () {
        var address = '0xfec7b00dc0192319dda0c777a9f04e47dc49bd18';
        var addressWithChecksum = '0xfEc7B00DC0192319DdA0c777A9F04E47Dc49bD18';
    };
    TestFunctions.prototype.messageToHashToSign = function (message) {
        // https://bitcoin.stackexchange.com/questions/36838/why-does-the-standard-bitcoin-message-signature-include-a-magic-prefix
        var bitcoinPrefixString = '\x18Bitcoin Signed Message:\n';
        var bitcoinPrefixBuffer = Buffer.from(bitcoinPrefixString, 'utf8');
        var messageBuffer = Buffer.from(message.length.toString() + message, 'utf8');
        var messageSize = message.length;
        // source code from 
        // https://github.com/bitcoinjs/bitcoinjs-lib/blob/1079bf95c1095f7fb018f6e4757277d83b7b9d07/src/message.js#L13
        // function magicHash (message, network) {
        //   var messagePrefix = new Buffer(network.messagePrefix)
        //   var messageBuffer = new Buffer(message)
        //   var lengthBuffer = bufferutils.varIntBuffer(messageBuffer.length)
        //   var buffer = Buffer.concat([messagePrefix, lengthBuffer, messageBuffer])
        //   return crypto.hash256(buffer)
        // }
        //const string strMessageMagic = "Diamond Signed Message:\n";
        var buffer = Buffer.alloc(bitcoinPrefixBuffer.byteLength + messageBuffer.byteLength);
        bitcoinPrefixBuffer.copy(buffer, 0);
        messageBuffer.copy(buffer, bitcoinPrefixBuffer.length);
        console.log("Buffer to sign:");
        console.log(buffer.toString('hex'));
        var hashResult = js_sha256_1["default"].sha256(js_sha256_1["default"].sha256(messageBuffer));
        console.log('HashResult: ' + hashResult);
        // 6b4539ed373c9977a4b66f9abdece0884bb9e546ed4a76855297edb703d05486
        var hashResultString = hashResult;
        if (hashResultString) {
            return Buffer.from(hashResultString, 'hex');
        }
        throw new Error('sha256 should return a string.');
        //20 byte result
        //return crypto.hash256(buffer)
    };
    TestFunctions.prototype.recoveryToXY = function (strangeResult) {
        //var EC = require('elliptic').ec;
        // Create and initialize EC context
        // (better do it once and reuse it)
        // var ec = new EC.ec('secp256k1');
        // const key = ec.keyFromPublic(buf);
        // const publicKey = key.getPublic();
        return {
            x: this.ellipticHexStringToWeb3HexString(strangeResult.x),
            y: this.ellipticHexStringToWeb3HexString(strangeResult.y)
        };
    };
    // public xyFromRS(buf: Buffer) : {x: string ,y: string} {
    //   //var EC = require('elliptic').ec;
    //   // Create and initialize EC context
    //   // (better do it once and reuse it)
    //   var ec = new EC.ec('secp256k1');
    //   const recoverResult = ec.recoverPubKey(msg, signature, 27);
    //   const key = ec.keyFromPublic(buf);
    //   const publicKey = key.getPublic();
    //   return { 
    //     x: publicKey.getX().toString(), 
    //     y: publicKey.getX().toString() 
    //   }
    // }
    TestFunctions.prototype.ellipticHexStringToWeb3HexString = function (strangeType) {
        var ellipticHexString = JSON.stringify(strangeType);
        ellipticHexString = ellipticHexString.replace('"', '').replace('"', '');
        return '0x' + ellipticHexString;
    };
    // public async messageToHashInContract(value: string) : Buffer {
    //   const result27 = await this.instance.methods.claimMessageCreate(message, true, hashHex, xy27.x, xy27.y, 27, rHex, sHex).call();
    // } 
    TestFunctions.prototype.testAddressRecovery = function () {
        return __awaiter(this, void 0, void 0, function () {
            var message, signatureBase64, btcAddressBase64, claimMessage, hashResultSolidity, hash, sig, hashHex, rHex, sHex, ec, sig27, sig28, recoverResult27, recoverResult28, xy27, xy28, result27, result28;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        message = "0x70A830C7EffF19c9Dd81Db87107f5Ea5804cbb3F";
                        signatureBase64 = "IHe2FvaAsIbIEvb47prSFg3rXNHlE91p2WYtpxIpPA30W6zgvzwc3wQ90nnA12LbL2aKo3a0jjgbN6xM7EOu/hE=";
                        btcAddressBase64 = "1BzFQE9RWjNQEuN2pJTFEHN21LureERhKX";
                        return [4 /*yield*/, this.instance.methods.createClaimMessage(message, true).call()];
                    case 1:
                        claimMessage = _a.sent();
                        console.log('Claim Message:');
                        console.log(claimMessage);
                        return [4 /*yield*/, this.instance.methods.calcHash256(claimMessage).call()];
                    case 2:
                        hashResultSolidity = _a.sent();
                        console.log('hash Result Solidity:', hashResultSolidity);
                        hash = Buffer.from(hashResultSolidity, 'hex');
                        console.log("hash: " + hash.toString('hex'));
                        sig = this.cryptoJS.signatureBase64ToRSV(signatureBase64);
                        hashHex = '0x' + hash.toString('hex');
                        rHex = '0x' + sig.r.toString('hex');
                        sHex = '0x' + sig.s.toString('hex');
                        ec = new elliptic_1["default"].ec('secp256k1');
                        sig27 = { r: sig.r.toString('hex'), s: sig.s.toString('hex'), recoveryParam: 0 };
                        sig28 = { r: sig.r.toString('hex'), s: sig.s.toString('hex'), recoveryParam: 1 };
                        recoverResult27 = ec.recoverPubKey(hash, sig27, 0);
                        recoverResult28 = ec.recoverPubKey(hash, sig28, 1);
                        xy27 = this.recoveryToXY(recoverResult27);
                        xy28 = this.recoveryToXY(recoverResult28);
                        console.log('xy27: ', xy27);
                        console.log('xy28: ', xy28);
                        return [4 /*yield*/, this.instance.methods.claimMessageMatchesSignature(message, true, xy27.x, xy27.y, 27, rHex, sHex).call()];
                    case 3:
                        result27 = _a.sent();
                        return [4 /*yield*/, this.instance.methods.claimMessageMatchesSignature(message, true, xy28.x, xy28.y, 28, rHex, sHex).call()];
                    case 4:
                        result28 = _a.sent();
                        console.log('result27: ', result27);
                        console.log('result28: ', result28);
                        return [2 /*return*/];
                }
            });
        });
    };
    TestFunctions.prototype.testBitcoinSignAndRecovery = function () {
        var keyPair = bitcoinjs_lib_1["default"].ECPair.fromWIF('5KYZdUEo39z3FPrtuX2QbbwGnNP5zTd7yyr2SC1j299sBCnWjss');
        var privateKey = keyPair.privateKey;
        var message = 'This is an example of a signed message.';
        var signature = bitcoinjs_message_1["default"].sign(message, privateKey, keyPair.compressed);
        console.log(signature.toString('base64'));
        var signature = bitcoinjs_message_1["default"].sign(message, privateKey, keyPair.compressed, { segwitType: 'p2sh(p2wpkh)' });
        console.log(signature.toString('base64'));
    };
    return TestFunctions;
}());
exports.TestFunctions = TestFunctions;
//
//const test = new TestFunctions(null, null);
//test.testAddressRecovery();
//# sourceMappingURL=testFunctions.js.map