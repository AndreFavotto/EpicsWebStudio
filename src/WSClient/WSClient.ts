import type { WSMessage } from "../types/pvaPyWS";

type ConnectHandler = (connected: boolean) => void;
type MessageHandler = (message: WSMessage) => void;

function normalizeBase64(b64: string): string {
  return b64.replace(/-/g, "+").replace(/_/g, "/");
}

function base64ToArrayBuffer(b64: string): ArrayBuffer {
  const binary = atob(normalizeBase64(b64));
  const len = binary.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

function isWSMessage(obj: unknown): obj is WSMessage {
  return typeof obj === "object" && obj !== null && ("pv" in obj || "value" in obj);
}

export class WSClient {
  private url: string;
  private connect_handler: ConnectHandler;
  private message_handler: MessageHandler;

  private connected = false;
  private socket!: WebSocket;
  private values: Record<string, WSMessage> = {};

  reconnect_ms = 5000;

  constructor(url: string, connect_handler: ConnectHandler, message_handler: MessageHandler) {
    this.url = url;
    this.connect_handler = connect_handler;
    this.message_handler = message_handler;
  }

  open(): void {
    this.connect_handler(false);
    this.socket = new WebSocket(this.url);
    this.socket.onopen = (event) => this.handleConnection(event);
    this.socket.onmessage = (event) => this.handleMessage(event.data as string);
    this.socket.onclose = (event) => this.handleClose(event);
    this.socket.onerror = (event) => this.handleError(event);
  }

  private handleConnection(_event: Event): void {
    this.connected = true;
    this.connect_handler(true);
  }

  private handleMessage(message: string): void {
    const uncheckedMessage: unknown = JSON.parse(message);

    if (!isWSMessage(uncheckedMessage)) {
      console.error("Received invalid message:", message);
      return;
    }

    const msg = uncheckedMessage;

    if (msg.type === "update") {
      // decode base64 arrays into JS arrays
      if (msg.b64dbl !== undefined) {
        msg.value = Array.from(new Float64Array(base64ToArrayBuffer(msg.b64dbl)));
        delete msg.b64dbl;
      } else if (msg.b64flt !== undefined) {
        msg.value = Array.from(new Float32Array(base64ToArrayBuffer(msg.b64flt)));
        delete msg.b64flt;
      } else if (msg.b64srt !== undefined) {
        msg.value = Array.from(new Int16Array(base64ToArrayBuffer(msg.b64srt)));
        delete msg.b64srt;
      } else if (msg.b64int !== undefined) {
        msg.value = Array.from(new Int32Array(base64ToArrayBuffer(msg.b64int)));
        delete msg.b64int;
      } else if (msg.b64byt !== undefined) {
        msg.value = Array.from(new Uint8Array(base64ToArrayBuffer(msg.b64byt)));
        delete msg.b64byt;
      }
    }
    this.message_handler(msg);
  }

  private handleError(event: Event): void {
    console.error("Error from " + this.url);
    console.error(event);
    this.close();
  }

  private handleClose(event: CloseEvent): void {
    this.connected = false;
    this.connect_handler(false);
    let message = `Web socket closed (${event.code}`;
    if (event.reason) {
      message += `, ${event.reason}`;
    }
    message += ")";
    console.log(message);
  }

  isConnected(): boolean {
    return this.connected;
  }

  subscribe(pvs: string | string[]): void {
    if (!this.connected) return;
    if (!Array.isArray(pvs)) {
      pvs = [pvs];
    }
    console.log("subscribing", { type: "subscribe", pvs });
    this.socket.send(JSON.stringify({ type: "subscribe", pvs }));
  }

  unsubscribe(pvs: string | string[]): void {
    if (!this.connected) return;
    if (!Array.isArray(pvs)) {
      pvs = [pvs];
    }
    this.socket.send(JSON.stringify({ type: "unsubscribe", pvs }));

    for (const pv of pvs) {
      delete this.values[pv];
    }
  }

  write(pv: string, value: number | string): void {
    if (!this.connected) return;
    this.socket.send(JSON.stringify({ type: "write", pv, value }));
  }

  close(): void {
    if (!this.connected) return;
    this.socket.close();
  }
}
