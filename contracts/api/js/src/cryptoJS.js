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
var base58check_1 = __importDefault(require("base58check"));
var elliptic_1 = __importDefault(require("elliptic"));
//import { toBase58Check, fromBase58Check } from 'bitcoinjs-lib/types/address';
//var bs58check = require('bs58check');
var bitcoinMessage = require('bitcoinjs-message');
var secp256k1 = require('secp256k1');
var SEGWIT_TYPES = {
    P2WPKH: 'p2wpkh',
    P2SH_P2WPKH: 'p2sh(p2wpkh)'
};
/**
 * Crypto functions used in this project implemented in JS.
 */
var CryptoJS = /** @class */ (function () {
    function CryptoJS() {
    }
    CryptoJS.prototype.messageToHash = function (messageString) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    /**
     *
     * @param address dmd or bitcoin style address.
     * @return Buffer with the significant bytes of the public key, not including the version number prefix, or the checksum postfix.
     */
    CryptoJS.prototype.dmdAddressToRipeResult = function (address) {
        console.log('address:', address);
        var decoded = base58check_1["default"].decode(address);
        console.log('decoded:', decoded);
        return decoded.data;
    };
    CryptoJS.prototype.signatureBase64ToRSV = function (signatureBase64) {
        //var ec = new EC.ec('secp256k1');
        //const input = new EC. SignatureInput();
        // const signature = new EC.ec.Signature(signatureBase64, 'base64');
        // const rr = signature.r.toBuffer();
        // const ss = signature.s.toBuffer();
        // const vv = signature.recoveryParam;
        // console.log(`r: ${rr.toString('hex')}`);
        // console.log(`s: ${ss.toString('hex')}`);
        // console.log(`v: ${vv}`);
        // return { r: rr, s: ss, v: vv};
        // where is the encoding of the signature documented ?
        //is that DER encoding ? Or the Significant part of DER ?
        var sig = Buffer.from(signatureBase64, 'base64');
        console.log('sigBuffer:');
        console.log(sig);
        console.log(sig.toString('hex'));
        //thesis: 
        // 20 is a header, and v is not included in the signature ?
        var sizeOfRComponent = sig[0];
        console.log('sizeOfR:', sizeOfRComponent);
        var rStart = 1; // r Start is always one (1).
        var sStart = 1 + sizeOfRComponent;
        var sizeOfSComponent = sig.length - sStart;
        console.log('sizeOfS:', sizeOfSComponent);
        if (sizeOfRComponent > sig.length) {
            throw new Error('sizeOfRComponent is too Big!!');
        }
        var r = sig.subarray(rStart, rStart + sizeOfRComponent);
        var s = sig.subarray(sStart, 65);
        var v = 0; //sig[64];
        console.log("r: " + r.toString('hex'));
        console.log("s: " + s.toString('hex'));
        console.log("v: " + v);
        return { r: r, s: s, v: v };
    };
    CryptoJS.prototype.decodeSignature = function (buffer) {
        if (buffer.length !== 65)
            throw new Error('Invalid signature length');
        var flagByte = buffer.readUInt8(0) - 27;
        if (flagByte > 15 || flagByte < 0) {
            throw new Error('Invalid signature parameter');
        }
        return {
            compressed: !!(flagByte & 12),
            segwitType: !(flagByte & 8)
                ? null
                : !(flagByte & 4)
                    ? SEGWIT_TYPES.P2SH_P2WPKH
                    : SEGWIT_TYPES.P2WPKH,
            recovery: flagByte & 3,
            signature: buffer.slice(1)
        };
    };
    CryptoJS.prototype.getPublicKeyFromSignature = function (signatureBase64, messageContent) {
        //const signatureBase64 = "IBHr8AT4TZrOQSohdQhZEJmv65ZYiPzHhkOxNaOpl1wKM/2FWpraeT8L9TaphHI1zt5bI3pkqxdWGcUoUw0/lTo=";
        //const address = "";
        var signature = Buffer.from(signatureBase64, 'base64');
        var parsed = this.decodeSignature(signature);
        console.log('parsed Signature:', parsed);
        var hash = bitcoinMessage.magicHash(messageContent);
        var publicKey = secp256k1.recover(hash, parsed.signature, parsed.recovery, parsed.compressed);
        //we now have the public key
        //public key is the X Value with a prefix.
        //it's 02 or 03 prefix, depending if y is ODD or not.
        console.log("publicKey: ", publicKey.toString('hex'));
        var x = publicKey.slice(1).toString('hex');
        console.log("x: " + x);
        var ec = new elliptic_1["default"].ec('secp256k1');
        var key = ec.keyFromPublic(publicKey);
        var y = key.getPublic().getY().toString('hex');
        console.log("y: " + y);
        return { publicKey: publicKey.toString('hex'), x: x, y: y };
    };
    return CryptoJS;
}());
exports.CryptoJS = CryptoJS;
//# sourceMappingURL=cryptoJS.js.map