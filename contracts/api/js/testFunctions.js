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
exports.__esModule = true;
var TestFunctions = /** @class */ (function () {
    function TestFunctions(web3Instance, instance) {
        this.web3Instance = web3Instance;
        this.instance = instance;
    }
    TestFunctions.prototype.testValidateSignature = function () {
        return __awaiter(this, void 0, void 0, function () {
            var addressToSign, dmdAddress, dmdSignature, dmdSignatureHex2, hashOfSignedInfo, sig, r, s, v;
            return __generator(this, function (_a) {
                addressToSign = '0x70A830C7EffF19c9Dd81Db87107f5Ea5804cbb3F';
                dmdAddress = 'dR9uN3GXDikmiipy3p8L9fJ4pzCiHYfcrz';
                dmdSignature = 'IIJrgH2LVfla214fObfGHMvEVxmEMtZjXK9fCT/3PWpnYSzGS0AZWzXDhGKt9wjX6Z6V0qS1gFNE7RZeUSD61CU=';
                dmdSignatureHex2 = '0x20826b807d8b55f95adb5e1f39b7c61ccbc457198432d6635caf5f093ff73d6a67612cc64b40195b35c38462adf708d7e99e95d2a4b5805344ed165e5120fad425';
                hashOfSignedInfo = "";
                sig = Buffer.from(dmdSignatureHex2, 'hex');
                if (sig.byteLength != 65) {
                    throw Error("Expected length of 65");
                }
                console.log(sig);
                r = Uint8Array.from(sig.slice(0, 32));
                s = Uint8Array.from(sig.slice(32, 64));
                v = Uint8Array.from(sig.slice(64, 65));
                console.log('r', r);
                console.log('s', s);
                console.log('v', v);
                //this.instance.methods.getPublicKeyFromBitcoinSignature(hashOfSignedInfo,  );
                return [2 /*return*/, "scheisse"];
            });
        });
    };
    ;
    return TestFunctions;
}());
exports.TestFunctions = TestFunctions;
//# sourceMappingURL=testFunctions.js.map