// Utility functions for Base64 decoding
export function toByteArray(b64: string): Uint8Array {
  const code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  const revLookup: number[] = [];

  for (let i = 0; i < code.length; ++i) {
    revLookup[code.charCodeAt(i)] = i;
  }
  revLookup["-".charCodeAt(0)] = 62;
  revLookup["_".charCodeAt(0)] = 63;

  const getLens = (b64: string): [number, number] => {
    const len = b64.length;
    if (len % 4 > 0) {
      throw new Error("Invalid string. Length must be a multiple of 4");
    }
    let validLen = b64.indexOf("=");
    if (validLen === -1) validLen = len;
    const placeHoldersLen = validLen === len ? 0 : 4 - (validLen % 4);
    return [validLen, placeHoldersLen];
  };

  const [validLen, placeHoldersLen] = getLens(b64);
  const arr = new Uint8Array(((validLen + placeHoldersLen) * 3) / 4 - placeHoldersLen);

  let curByte = 0;
  const len = placeHoldersLen > 0 ? validLen - 4 : validLen;

  let tmp: number;
  for (let i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)];
    arr[curByte++] = (tmp >> 16) & 0xff;
    arr[curByte++] = (tmp >> 8) & 0xff;
    arr[curByte++] = tmp & 0xff;
  }

  if (placeHoldersLen === 2) {
    tmp = (revLookup[b64.charCodeAt(len)] << 2) | (revLookup[b64.charCodeAt(len + 1)] >> 4);
    arr[curByte++] = tmp & 0xff;
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(len)] << 10) |
      (revLookup[b64.charCodeAt(len + 1)] << 4) |
      (revLookup[b64.charCodeAt(len + 2)] >> 2);
    arr[curByte++] = (tmp >> 8) & 0xff;
    arr[curByte++] = tmp & 0xff;
  }

  return arr;
}
