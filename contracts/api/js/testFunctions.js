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
var ethereumjs_util_1 = require("ethereumjs-util");
var TestFunctions = /** @class */ (function () {
    function TestFunctions(web3Instance, instance) {
        this.web3Instance = web3Instance;
        this.instance = instance;
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
    TestFunctions.prototype.signatureBase64ToRSV = function (signatureBase64) {
        var sig = Buffer.from(signatureBase64, 'base64');
        //r: 2077b616f680b086c812f6f8ee9ad2160deb5cd1e513dd69d9662da712293c0d
        //s: f45bace0bf3c1cdf043dd279c0d762db2f668aa376b48e381b37ac4cec43aefe
        //v: 17
        console.log('sigBuffer:');
        console.log(sig);
        console.log(sig.toString('hex'));
        var r = sig.subarray(0, 32);
        var s = sig.subarray(32, 64);
        var v = sig[64];
        console.log("r: " + r.toString('hex'));
        console.log("s: " + s.toString('hex'));
        console.log("v: " + v);
        return { r: r, s: s, v: v };
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
    TestFunctions.prototype.testAddressRecovery = function () {
        return __awaiter(this, void 0, void 0, function () {
            var message, signatureBase64, btcAddressBase64, hash, sig, hashHex, rHex, sHex, ercRecoverResult27, ercRecoverResult28, checkSignatureResult27, checkSignatureResult28;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        message = "0x70A830C7EffF19c9Dd81Db87107f5Ea5804cbb3F";
                        signatureBase64 = "IHe2FvaAsIbIEvb47prSFg3rXNHlE91p2WYtpxIpPA30W6zgvzwc3wQ90nnA12LbL2aKo3a0jjgbN6xM7EOu/hE=";
                        btcAddressBase64 = "1BzFQE9RWjNQEuN2pJTFEHN21LureERhKX";
                        hash = this.messageToHashToSign(message);
                        console.log("hash: " + hash.toString('hex'));
                        sig = this.signatureBase64ToRSV(signatureBase64);
                        hashHex = '0x' + hash.toString('hex');
                        rHex = '0x' + sig.r.toString('hex');
                        sHex = '0x' + sig.s.toString('hex');
                        ercRecoverResult27 = ethereumjs_util_1.ecrecover(hash, 27, sig.r, sig.s);
                        console.log('js ercRecoverResult27: (public key) ' + ercRecoverResult27.toString('hex'));
                        ercRecoverResult28 = ethereumjs_util_1.ecrecover(hash, 28, sig.r, sig.s);
                        console.log('js ercRecoverResult28: (public key) ' + ercRecoverResult28.toString('hex'));
                        return [4 /*yield*/, this.instance.methods.checkSignature(hashHex, rHex, sHex, 27)
                                .call()];
                    case 1:
                        checkSignatureResult27 = _a.sent();
                        return [4 /*yield*/, this.instance.methods.checkSignature(hashHex, rHex, sHex, 28)
                                .call()];
                    case 2:
                        checkSignatureResult28 = _a.sent();
                        console.log('Recovered Address from solidity:');
                        console.log('27: ' + checkSignatureResult27);
                        console.log('28: ' + checkSignatureResult28);
                        return [2 /*return*/];
                }
            });
        });
    };
    return TestFunctions;
}());
exports.TestFunctions = TestFunctions;
//const test = new TestFunctions(null, null);
//test.testAddressRecovery();
//# sourceMappingURL=testFunctions.js.map