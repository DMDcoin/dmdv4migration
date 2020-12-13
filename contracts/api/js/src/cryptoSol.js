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
exports.__esModule = true;
exports.CryptoSol = void 0;
var cryptoHelpers_1 = require("./cryptoHelpers");
var cryptoJS_1 = require("./cryptoJS");
var cryptoHelpers_2 = require("./cryptoHelpers");
/**
 * Crypto functions used in this project implemented in Soldity.
 */
var CryptoSol = /** @class */ (function () {
    function CryptoSol(web3Instance, instance) {
        this.web3Instance = web3Instance;
        this.instance = instance;
        this.cryptoJS = new cryptoJS_1.CryptoJS();
        this.logDebug = false;
        if (instance === undefined || instance === null) {
            throw Error("Claim contract must be defined!!");
        }
        this.log('constructed!');
    }
    CryptoSol.prototype.setLogDebug = function (value) {
        this.logDebug = value;
        this.cryptoJS.setLogDebug(value);
    };
    CryptoSol.prototype.log = function (message) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        if (this.logDebug) {
            console.log.apply(console, __spreadArrays([message], params));
        }
    };
    CryptoSol.prototype.addressToHashToSign = function (address) {
    };
    /**
     * Retrieves the message that is used for hashing in bitcoin. (enpacking it with the Envolope)
     * see also: https://bitcoin.stackexchange.com/questions/77324/how-are-bitcoin-signed-messages-generated
     * @param address Ethereum style address, include checksum information.
     */
    CryptoSol.prototype.addressToClaimMessage = function (address, postfix) {
        if (postfix === void 0) { postfix = ''; }
        return __awaiter(this, void 0, void 0, function () {
            var postfixHex, claimMessage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        postfixHex = cryptoHelpers_1.stringToUTF8Hex(postfix);
                        return [4 /*yield*/, this.instance.methods.createClaimMessage(address, true, postfixHex).call()];
                    case 1:
                        claimMessage = _a.sent();
                        this.log('Claim Message:');
                        this.log(claimMessage);
                        return [2 /*return*/, claimMessage];
                }
            });
        });
    };
    CryptoSol.prototype.messageToHash = function (messageString) {
        return __awaiter(this, void 0, void 0, function () {
            var buffer, hash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        buffer = Buffer.from(messageString, 'utf-8');
                        return [4 /*yield*/, this.instance.methods.calcHash256(buffer.toString('hex')).call()];
                    case 1:
                        hash = _a.sent();
                        this.log('messageToHash');
                        this.log(hash);
                        return [2 /*return*/, hash];
                }
            });
        });
    };
    CryptoSol.prototype.claimMessageMatchesSignature = function (claimToAddress, addressContainsChecksum, postfix, pubkeyX, pubkeyY, sigV, sigR, sigS) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.instance.methods.claimMessageMatchesSignature(claimToAddress, addressContainsChecksum, cryptoHelpers_1.stringToUTF8Hex(postfix), cryptoHelpers_1.ensure0x(pubkeyX), cryptoHelpers_1.ensure0x(pubkeyY), cryptoHelpers_1.ensure0x(sigV), cryptoHelpers_1.ensure0x(sigR), cryptoHelpers_1.ensure0x(sigS)).call()];
                    case 1:
                        result = _a.sent();
                        this.log('Claim Result: ', result);
                        return [2 /*return*/, result];
                }
            });
        });
    };
    CryptoSol.prototype.getEthAddressFromSignature = function (claimToAddress, addressContainsChecksum, postfix, sigV, sigR, sigS) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.instance.methods.getEthAddressFromSignature(claimToAddress, addressContainsChecksum, cryptoHelpers_1.stringToUTF8Hex(postfix), cryptoHelpers_1.ensure0x(sigV), cryptoHelpers_1.ensure0x(sigR), cryptoHelpers_1.ensure0x(sigS)).call()];
            });
        });
    };
    /**
     * returns the essential part of a Bitcoin-style legacy compressed address associated with the given ECDSA public key
     * @param x X coordinate of the ECDSA public key
     * @param y Y coordinate of the ECDSA public key
     * @returns Hex string holding the essential part of the legacy compressed address associated with the given ECDSA public key
     */
    CryptoSol.prototype.publicKeyToBitcoinAddressEssential = function (x, y) {
        return __awaiter(this, void 0, void 0, function () {
            var legacyCompressedEnumValue;
            return __generator(this, function (_a) {
                legacyCompressedEnumValue = 1;
                return [2 /*return*/, this.instance.methods.publicKeyToBitcoinAddress('0x' + x.toString('hex'), '0x' + y.toString('hex'), legacyCompressedEnumValue).call()];
            });
        });
    };
    CryptoSol.prototype.publicKeyToBitcoinAddress = function (x, y, addressPrefix) {
        return __awaiter(this, void 0, void 0, function () {
            var essentialPart;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.publicKeyToBitcoinAddressEssential(x, y)];
                    case 1:
                        essentialPart = _a.sent();
                        return [2 /*return*/, this.cryptoJS.bitcoinAddressEssentialToFullQualifiedAddress(essentialPart, addressPrefix)];
                }
            });
        });
    };
    CryptoSol.prototype.pubKeyToEthAddress = function (x, y) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.instance.methods.pubKeyToEthAddress(x, y).call()];
            });
        });
    };
    CryptoSol.prototype.prefixString = function () {
        return __awaiter(this, void 0, void 0, function () {
            var bytes, buffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.instance.methods.prefixStr().call()];
                    case 1:
                        bytes = _a.sent();
                        buffer = cryptoHelpers_2.hexToBuf(bytes);
                        return [2 /*return*/, new TextDecoder("utf-8").decode(buffer)];
                }
            });
        });
    };
    return CryptoSol;
}());
exports.CryptoSol = CryptoSol;
//# sourceMappingURL=cryptoSol.js.map