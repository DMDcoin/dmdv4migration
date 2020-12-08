"use strict";
exports.__esModule = true;
exports.stringToUTF8Hex = exports.prefixBuf = exports.hexToBuf = exports.ensure0x = exports.remove0x = void 0;
function remove0x(input) {
    if (input.startsWith('0x')) {
        return input.substring(2);
    }
    return input;
}
exports.remove0x = remove0x;
function ensure0x(input) {
    if (input instanceof Buffer) {
        input = input.toString('hex');
    }
    if (!input.startsWith('0x')) {
        return '0x' + input;
    }
    return input;
}
exports.ensure0x = ensure0x;
function hexToBuf(input) {
    return Buffer.from(remove0x(input), 'hex');
}
exports.hexToBuf = hexToBuf;
// appends a prefix to inputBuffer.
function prefixBuf(inputBuffer, prefixHexString) {
    var prefix = hexToBuf(prefixHexString);
    return Buffer.concat([prefix, inputBuffer]);
}
exports.prefixBuf = prefixBuf;
function stringToUTF8Hex(input) {
    return ensure0x(Buffer.from(input, 'utf8'));
}
exports.stringToUTF8Hex = stringToUTF8Hex;
//# sourceMappingURL=cryptoHelpers.js.map