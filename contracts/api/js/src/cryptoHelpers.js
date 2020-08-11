"use strict";
exports.__esModule = true;
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
//# sourceMappingURL=cryptoHelpers.js.map