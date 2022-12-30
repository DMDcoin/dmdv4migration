
export function remove0x(input: string) {
  if (input.startsWith('0x')) {
    return input.substring(2);
  }
  return input;
}

export function ensure0x(input: string | Buffer) {

  if (input instanceof Buffer) {
    input = input.toString('hex');
  }

  if (!input.startsWith('0x')) {
    return '0x' + input;
  }
  return input;

}


export function hexToBuf(input: string) : Buffer {
  if (input == null) {
    return Buffer.alloc(0);
  }
  return Buffer.from(remove0x(input), 'hex');
}

// appends a prefix to inputBuffer.
export function prefixBuf(inputBuffer: Buffer, prefixHexString: string) {
  const prefix = hexToBuf(prefixHexString);
  return Buffer.concat([prefix, inputBuffer]);
}


export function stringToUTF8Hex(input: string) : string {

  return ensure0x(Buffer.from(input, 'utf8'));
  
}
