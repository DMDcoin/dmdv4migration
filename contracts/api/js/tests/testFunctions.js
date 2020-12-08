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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.TestFunctions = void 0;
var js_sha256_1 = __importDefault(require("js-sha256"));
var chai_1 = require("chai");
var varuint_bitcoin_1 = __importDefault(require("varuint-bitcoin"));
var cryptoJS_1 = require("../src/cryptoJS");
var elliptic_1 = __importDefault(require("elliptic"));
var cryptoSol_1 = require("../src/cryptoSol");
var BN = require("bn.js");
var cryptoHelpers_1 = require("../src/cryptoHelpers");
var bitcoin = require('bitcoinjs-lib');
var bitcoinMessage = require('bitcoinjs-message');
var TestFunctions = /** @class */ (function () {
    function TestFunctions(web3Instance, instance) {
        this.web3Instance = web3Instance;
        this.instance = instance;
        this.cryptoJS = new cryptoJS_1.CryptoJS();
        this.logDebug = false;
        if (instance === undefined || instance === null) {
            throw Error("Claim contract must be defined!!");
        }
        this.cryptoSol = new cryptoSol_1.CryptoSol(web3Instance, instance);
    }
    TestFunctions.prototype.setLogDebug = function (value) {
        this.logDebug = value;
        this.cryptoSol.setLogDebug(value);
        this.cryptoJS.setLogDebug(value);
    };
    TestFunctions.prototype.log = function (message) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        if (this.logDebug) {
            console.log.apply(console, __spreadArrays([message], params));
        }
    };
    TestFunctions.prototype.getTestSignatures = function () {
        //returns a bunch of test signatures used in various tests.
        //those are created with  https://reinproject.org/bitcoin-signature-tool/#sign
        // the signed message is: "0x70A830C7EffF19c9Dd81Db87107f5Ea5804cbb3F";
        // the private key is: 
        var signaturesBase64 = ["IA7ZY6Vi52XpL6BKiq74jeP7phdBJO5JqgsEUsmUDZZFNWnsC6X3kknADhJdXCTLcjAUI1bwn1IAVprv/krj7tQ=",
            "IJ42x26AH10GPhfnXdHMzj5KAmjekeaS4sA6uo2unlW+GLJqSSrVW03sYFIouW/oOE6v/uCl5z0jgmbLmOngSXI=",
            "Hw9HBbWTVJkMOqfqy2CscivlB/CzNR3sanGhguYSWtshv5VOjffwEopeES+UnsrLPvYFtgA1jQKWGAyR8lEE3AA=",
            "H1lPAFpDfLx6tSUyWSRmiYeuHbUaGzy2Lx+FhqXyQ+y/DIg3Ep8xGNyrn5hDDDt314UbPB9E5QpI75JoEU3ZUE4=",
            "H+FQO+Am4R+k8hzw9U5ImJLCtikbmr8hqVcGfpdjDMnvPIal7HMIINX8WYhQ1LzxiXKoSFDAnJbS9Q8rBAdtZag=",
            "IOzKhB75qO45TUaXcuHZhW+3fFhFhRHUJhYTK+Rqzlftov1FTt5PeC2p5+tpkF8sYemm5tclPppg4vSt5N0Pp6E=",
            "IE8itTa9jSnTCC2TwJAyFIk60wbXlz8wpN3htH3+Zb5uLH0QZd60IsouCkyIZem16z9DwscFjPeBWOSmYbH26D0=",
            "HzwB2jWF13IxdjadcNU/hEapqGBsIrvJIhHqyWx6t8lK5YM9Wg0A6AZ91wwChjAm55ESymyiciS0dxGI2Uakm88=",
            "IEgJZn56Gd0u5ZnUAXHcCkuBSIHrymvoqsZF8sGDvr0ZiY7yfKJ7RhR4+tWWmjTHHIxOfhv0Wa7FNz7yC8v3LUY=",
            "IIf+kRcuzsQPbR5bW2W1Kz9urfxmsM0MbGYGuhML1pKdS8JLdUEEVEY86KIN/famgcQw43La02LTg142GBlGwaE=",
            "IIdIJSBKUExSabzNhmOtOamrTEnLHQeHEMVPM5BBfvYlTEtG3FvWzIWiAUe0ET4LFLWRkO8e6/TboyqYIT1QxgM=",
            "HxqyFxgt2+wWQB0hi5vt2yW7+3Qly+Rf7gNQIF8Ui+Zbj5JCalRrCcrJn2680QJuRBbIA9uc68wWS2J00LENRR8="
        ];
        return signaturesBase64;
    };
    TestFunctions.prototype.testAddressChecksum = function () {
        return __awaiter(this, void 0, void 0, function () {
            var address, addressWithChecksum, calcAddressResult, buffer, calcResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        address = '0xfec7b00dc0192319dda0c777a9f04e47dc49bd18';
                        addressWithChecksum = '0xfEc7B00DC0192319DdA0c777A9F04E47Dc49bD18';
                        return [4 /*yield*/, this.cryptoSol.instance.methods.calculateAddressString(address, true).call()];
                    case 1:
                        calcAddressResult = _a.sent();
                        buffer = Buffer.from(cryptoHelpers_1.remove0x(calcAddressResult), 'hex');
                        calcResult = buffer.toString('utf8');
                        //this.log('calcResult:', calcResult);
                        chai_1.assert.equal(calcResult, addressWithChecksum, 'checksum must be calculated in a correct ways.');
                        return [2 /*return*/];
                }
            });
        });
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
        this.log("Buffer to sign:");
        this.log(buffer.toString('hex'));
        var hashResult = js_sha256_1["default"].sha256(js_sha256_1["default"].sha256(messageBuffer));
        this.log('HashResult: ' + hashResult);
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
            var message, btcAddressbase58check, signatureBase64, claimMessage, hashResultSolidity, hash, sig, hashHex, rHex, sHex, ec, sig27, sig28, recoverResult27, recoverResult28, xy27, xy28, result27, result28;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        message = "0x70A830C7EffF19c9Dd81Db87107f5Ea5804cbb3F";
                        btcAddressbase58check = "1Q9G4T5rLaf4Rz39WpkwGVM7e2jMxD2yRj";
                        signatureBase64 = "IBHr8AT4TZrOQSohdQhZEJmv65ZYiPzHhkOxNaOpl1wKM/2FWpraeT8L9TaphHI1zt5bI3pkqxdWGcUoUw0/lTo=";
                        return [4 /*yield*/, this.instance.methods.createClaimMessage(message, true).call()];
                    case 1:
                        claimMessage = _a.sent();
                        this.log('Claim Message:');
                        this.log(claimMessage);
                        return [4 /*yield*/, this.instance.methods.calcHash256(claimMessage).call()];
                    case 2:
                        hashResultSolidity = _a.sent();
                        this.log('hash Result Solidity:', hashResultSolidity);
                        hash = Buffer.from(hashResultSolidity, 'hex');
                        this.log("hash: " + hash.toString('hex'));
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
                        this.log('xy27: ', xy27);
                        this.log('xy28: ', xy28);
                        return [4 /*yield*/, this.instance.methods.claimMessageMatchesSignature(message, true, xy27.x, xy27.y, 27, rHex, sHex, true).call()];
                    case 3:
                        result27 = _a.sent();
                        return [4 /*yield*/, this.instance.methods.claimMessageMatchesSignature(message, true, xy28.x, xy28.y, 28, rHex, sHex, true).call()];
                    case 4:
                        result28 = _a.sent();
                        this.log('result27: ', result27);
                        this.log('result28: ', result28);
                        return [2 /*return*/];
                }
            });
        });
    };
    TestFunctions.prototype.testBitcoinSignAndRecovery = function () {
        var keyPair = bitcoin.ECPair.fromWIF('5KYZdUEo39z3FPrtuX2QbbwGnNP5zTd7yyr2SC1j299sBCnWjss');
        var privateKey = keyPair.privateKey;
        var message = 'This is an example of a signed message.';
        var signature = bitcoinMessage.sign(message, privateKey, keyPair.compressed);
        this.log(signature.toString('base64'));
        var signature = bitcoinMessage.sign(message, privateKey, keyPair.compressed, { segwitType: 'p2sh(p2wpkh)' });
        this.log(signature.toString('base64'));
    };
    TestFunctions.prototype.testBitcoinMessageJS = function () {
        var privateKeyWid = 'L3qEYQGUWwhFvkR13DCdqahwSfc4BJHXJamNKXGB2wm45JJjzJ58';
        var address = '1Q9G4T5rLaf4Rz39WpkwGVM7e2jMxD2yRj';
        var message = '0x70A830C7EffF19c9Dd81Db87107f5Ea5804cbb3F';
        var keyPair = bitcoin.ECPair.fromWIF(privateKeyWid);
        var privateKey = keyPair.privateKey;
        var signature = bitcoinMessage.sign(message, privateKey, keyPair.compressed);
        this.log('signature: ', signature.toString('base64'));
        //var publicKey = keyPair.publicKey.toString('hex');
        //var signature = bitcoinMessage.
        //this.log(signature.toString('base64'))
        var verifyResult = bitcoinMessage.verify(message, address, signature);
        this.log('verifyResult = ', verifyResult);
        chai_1.expect(verifyResult).to.be.equal(true);
    };
    TestFunctions.prototype.getBitcoinSignedMessageMagic = function (message) {
        var messagePrefix = '\u0018Bitcoin Signed Message:\n';
        var messagePrefixBuffer = Buffer.from(messagePrefix, 'utf8');
        ;
        var messageBuffer = Buffer.from(message, 'utf8');
        var messageVISize = varuint_bitcoin_1["default"].encodingLength(message.length);
        var buffer = Buffer.allocUnsafe(messagePrefix.length + messageVISize + message.length);
        messagePrefixBuffer.copy(buffer, 0);
        varuint_bitcoin_1["default"].encode(message.length, buffer, messagePrefix.length);
        messageBuffer.copy(buffer, messagePrefix.length + messageVISize);
        return buffer;
    };
    TestFunctions.prototype.testMessageMagicHexIsCorrect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var address, resultJS, resultSol;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        address = '0x70A830C7EffF19c9Dd81Db87107f5Ea5804cbb3F';
                        resultJS = '0x' + this.getBitcoinSignedMessageMagic(address).toString('hex');
                        return [4 /*yield*/, this.cryptoSol.addressToClaimMessage(address)];
                    case 1:
                        resultSol = _a.sent();
                        chai_1.expect(resultSol).to.be.equal(resultJS);
                        return [2 /*return*/];
                }
            });
        });
    };
    TestFunctions.prototype.testPubKeyToEthAddress = function () {
        return __awaiter(this, void 0, void 0, function () {
            var expectedAddress, inputPrivateKey, ec, G, pk, pubPoint, x, y, publicKey, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedAddress = '0x7af37454aCaB6dB76c11bd33C94ED7C0b7A60B2a';
                        inputPrivateKey = 'c99dd56045c449952e16388925455cc32e4eb180f2a9c3d2afd587aaf1cceda5';
                        ec = new elliptic_1["default"].ec('secp256k1');
                        G = ec.g;
                        pk = new BN(inputPrivateKey, 'hex');
                        pubPoint = G.mul(pk);
                        x = pubPoint.getX().toBuffer();
                        y = pubPoint.getY().toBuffer();
                        publicKey = Buffer.concat([x, y]);
                        this.log("pub key::" + publicKey.toString('hex'));
                        return [4 /*yield*/, this.cryptoSol.pubKeyToEthAddress(x, y)];
                    case 1:
                        result = _a.sent();
                        this.log('pubKeyToEthAddress:', result);
                        chai_1.assert.equal(expectedAddress, result);
                        return [2 /*return*/];
                }
            });
        });
    };
    TestFunctions.prototype.testMessageHashIsCorrect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var message, hash, hashFromSolidity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        message = '0x70A830C7EffF19c9Dd81Db87107f5Ea5804cbb3F';
                        hash = '0x' + bitcoinMessage.magicHash(message).toString('hex');
                        this.log('Bitcoin Hash: ', hash);
                        return [4 /*yield*/, this.instance.methods.getHashForClaimMessage(message, true, true).call()];
                    case 1:
                        hashFromSolidity = _a.sent();
                        this.log('hashFromSolidity', hashFromSolidity);
                        chai_1.expect(hash).to.be.equal(hashFromSolidity);
                        return [2 /*return*/];
                }
            });
        });
    };
    TestFunctions.prototype.testSignatureToXY = function () {
        return __awaiter(this, void 0, void 0, function () {
            var message, signatureBase64, key;
            return __generator(this, function (_a) {
                message = "0x70A830C7EffF19c9Dd81Db87107f5Ea5804cbb3F";
                signatureBase64 = "IBHr8AT4TZrOQSohdQhZEJmv65ZYiPzHhkOxNaOpl1wKM/2FWpraeT8L9TaphHI1zt5bI3pkqxdWGcUoUw0/lTo=";
                key = this.cryptoJS.getPublicKeyFromSignature(signatureBase64, message);
                chai_1.expect(key.x).equal("5EF44A6382FABDCB62425D68A0C61998881A1417B9ED068513310DBAE8C61040".toLowerCase());
                chai_1.expect(key.y).equal("99523EB43291A1067FA819AA5A74F30810B19D15F6EDC19C9D8AA525B0F6C683".toLowerCase());
                chai_1.expect(key.publicKey).equal("035EF44A6382FABDCB62425D68A0C61998881A1417B9ED068513310DBAE8C61040".toLowerCase());
                return [2 /*return*/];
            });
        });
    };
    TestFunctions.prototype.testSignatureToXYMulti = function () {
        return __awaiter(this, void 0, void 0, function () {
            var message, signaturesBase64, index, signatureBase64, key;
            return __generator(this, function (_a) {
                message = "0x70A830C7EffF19c9Dd81Db87107f5Ea5804cbb3F";
                signaturesBase64 = this.getTestSignatures();
                for (index = 0; index < signaturesBase64.length; index++) {
                    signatureBase64 = signaturesBase64[index];
                    key = this.cryptoJS.getPublicKeyFromSignature(signatureBase64, message);
                    chai_1.expect(key.x).equal("5EF44A6382FABDCB62425D68A0C61998881A1417B9ED068513310DBAE8C61040".toLowerCase());
                    chai_1.expect(key.y).equal("99523EB43291A1067FA819AA5A74F30810B19D15F6EDC19C9D8AA525B0F6C683".toLowerCase());
                    chai_1.expect(key.publicKey).equal("035EF44A6382FABDCB62425D68A0C61998881A1417B9ED068513310DBAE8C61040".toLowerCase());
                }
                return [2 /*return*/];
            });
        });
    };
    TestFunctions.prototype.testSolECRecover = function () {
        return __awaiter(this, void 0, void 0, function () {
            var expectedEthAddress, message, signaturesBase64, index, signatureBase64, rs, recoveredETHAddress, recoveredETHAddress2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedEthAddress = '0xA5956975DE8711DFcc82DE5f8F5d151c41556656';
                        message = "0x70A830C7EffF19c9Dd81Db87107f5Ea5804cbb3F";
                        signaturesBase64 = this.getTestSignatures();
                        index = 0;
                        _a.label = 1;
                    case 1:
                        if (!(index < signaturesBase64.length)) return [3 /*break*/, 5];
                        signatureBase64 = this.getTestSignatures()[0];
                        rs = this.cryptoJS.signatureBase64ToRSV(signatureBase64);
                        return [4 /*yield*/, this.cryptoSol.getEthAddressFromSignature(message, true, '0x1b', rs.r, rs.s)];
                    case 2:
                        recoveredETHAddress = _a.sent();
                        return [4 /*yield*/, this.cryptoSol.getEthAddressFromSignature(message, true, '0x1c', rs.r, rs.s)];
                    case 3:
                        recoveredETHAddress2 = _a.sent();
                        this.log('recovered: ', recoveredETHAddress);
                        this.log('recovered: ', recoveredETHAddress2);
                        chai_1.expect(expectedEthAddress).to.be.oneOf([recoveredETHAddress, recoveredETHAddress2]); // on equal(expectedEthAddress);
                        _a.label = 4;
                    case 4:
                        index++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    TestFunctions.prototype.testPublicKeyToDMDAddress = function () {
        return __awaiter(this, void 0, void 0, function () {
            var publicKeyHex, expectedAddress, _a, x, y, bs58Result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        publicKeyHex = '035EF44A6382FABDCB62425D68A0C61998881A1417B9ED068513310DBAE8C61040';
                        expectedAddress = '1Q9G4T5rLaf4Rz39WpkwGVM7e2jMxD2yRj';
                        _a = this.cryptoJS.getXYfromPublicKeyHex(publicKeyHex), x = _a.x, y = _a.y;
                        return [4 /*yield*/, this.cryptoSol.publicKeyToBitcoinAddress(x, y, '00')];
                    case 1:
                        bs58Result = _b.sent();
                        chai_1.assert.equal(expectedAddress, bs58Result);
                        return [2 /*return*/];
                }
            });
        });
    };
    TestFunctions.prototype.testSignatureVerificationInContract = function () {
        return __awaiter(this, void 0, void 0, function () {
            var address, claimToAddress, signatureBase64, key, rs, txResult1, txResult2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        address = "1Q9G4T5rLaf4Rz39WpkwGVM7e2jMxD2yRj";
                        claimToAddress = "0x70A830C7EffF19c9Dd81Db87107f5Ea5804cbb3F";
                        signatureBase64 = this.getTestSignatures()[0];
                        key = this.cryptoJS.getPublicKeyFromSignature(signatureBase64, claimToAddress);
                        rs = this.cryptoJS.signatureBase64ToRSV(signatureBase64);
                        this.log('got public key X from signature:', key.x);
                        return [4 /*yield*/, this.cryptoSol.claimMessageMatchesSignature(claimToAddress, true, key.x, key.y, '0x1b', rs.r.toString('hex'), rs.s.toString('hex'), true)];
                    case 1:
                        txResult1 = _a.sent();
                        return [4 /*yield*/, this.cryptoSol.claimMessageMatchesSignature(claimToAddress, true, key.x, key.y, '0x1c', rs.r.toString('hex'), rs.s.toString('hex'), true)];
                    case 2:
                        txResult2 = _a.sent();
                        chai_1.expect(txResult1 || txResult2).to.be.equal(true, "Claim message did not match the signature");
                        return [2 /*return*/];
                }
            });
        });
    };
    TestFunctions.prototype.testSignatureVerificationInContractDMD = function () {
        return __awaiter(this, void 0, void 0, function () {
            var claimToAddress, signatureBase64, key, rs, txResult1, txResult2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        claimToAddress = "0xA8aA9df9c03505B8d10C344365aDa258d8a61d0b";
                        signatureBase64 = "IORJE5NrWNbfQOmfPjdOryNCbOrUZFtlgcclydZXLQq9XvGKKChM2YGoitnl7Cn3I+SAdOTQwpDoxcnQ7huEoUc=";
                        key = this.cryptoJS.getPublicKeyFromSignature(signatureBase64, claimToAddress);
                        rs = this.cryptoJS.signatureBase64ToRSV(signatureBase64);
                        this.log('got public key X from signature:', key.x);
                        return [4 /*yield*/, this.cryptoSol.claimMessageMatchesSignature(claimToAddress, true, key.x, key.y, '0x1b', rs.r.toString('hex'), rs.s.toString('hex'), true)];
                    case 1:
                        txResult1 = _a.sent();
                        return [4 /*yield*/, this.cryptoSol.claimMessageMatchesSignature(claimToAddress, true, key.x, key.y, '0x1c', rs.r.toString('hex'), rs.s.toString('hex'), true)];
                    case 2:
                        txResult2 = _a.sent();
                        chai_1.expect(txResult1 || txResult2).to.be.equal(true, "Claim message did not match the signature");
                        return [2 /*return*/];
                }
            });
        });
    };
    return TestFunctions;
}());
exports.TestFunctions = TestFunctions;
//# sourceMappingURL=testFunctions.js.map