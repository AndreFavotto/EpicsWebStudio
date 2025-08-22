function normalizeBase64(b64: string): string {
  return b64.replace(/-/g, "+").replace(/_/g, "/");
}

export function base64ToArrayBuffer(b64: string): ArrayBuffer {
  const binary = atob(normalizeBase64(b64)); // decode base64 to binary string
  const len = binary.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}
