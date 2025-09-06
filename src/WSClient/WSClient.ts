import type { WSMessage } from "../types/pvaPyWS";

type ConnectHandler = (connected: boolean) => void;
type MessageHandler = (message: WSMessage) => void;

/**
 * Normalizes a base64 string to standard Base64 format by replacing URL-safe
 * characters with standard characters.
 * @param b64 The base64 string to normalize.
 * @returns The normalized base64 string.
 */
function normalizeBase64(b64: string): string {
  return b64.replace(/-/g, "+").replace(/_/g, "/");
}

/**
 * Converts a base64-encoded string into an ArrayBuffer.
 * @param b64 The base64 string to decode.
 * @returns The decoded ArrayBuffer.
 */
function base64ToArrayBuffer(b64: string): ArrayBuffer {
  const binary = atob(normalizeBase64(b64));
  const len = binary.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Type guard to check if an object is a WSMessage.
 * @param obj The object to check.
 * @returns True if the object is a WSMessage, false otherwise.
 */
function isWSMessage(obj: unknown): obj is WSMessage {
  return typeof obj === "object" && obj !== null && ("pv" in obj || "value" in obj);
}

/**
 * WebSocket client for connecting to the pvaPy WebSocket server.
 * Handles subscribing, unsubscribing, writing, and receiving PV updates.
 */
export class WSClient {
  private url: string;
  private connect_handler: ConnectHandler;
  private message_handler: MessageHandler;

  private connected = false;
  private socket!: WebSocket;
  private values: Record<string, WSMessage> = {};

  reconnect_ms = 5000;

  /**
   * Creates a new WSClient instance.
   * @param url The WebSocket server URL.
   * @param connect_handler Callback for connection status changes.
   * @param message_handler Callback for incoming messages.
   */
  constructor(url: string, connect_handler: ConnectHandler, message_handler: MessageHandler) {
    this.url = url;
    this.connect_handler = connect_handler;
    this.message_handler = message_handler;
  }

  /**
   * Opens a new WebSocket connection and sets up event handlers.
   */
  open(): void {
    this.connect_handler(false);
    this.socket = new WebSocket(this.url);
    this.socket.onopen = (event) => this.handleConnection(event);
    this.socket.onmessage = (event) => this.handleMessage(event.data as string);
    this.socket.onclose = (event) => this.handleClose(event);
    this.socket.onerror = (event) => this.handleError(event);
  }

  /**
   * Handles the WebSocket 'open' event and notifies the connection handler.
   * @param _event The open event.
   */
  private handleConnection(_event: Event): void {
    this.connected = true;
    this.connect_handler(true);
  }

  /**
   * Handles incoming WebSocket messages, decodes base64 arrays, and forwards them.
   * @param message The raw WebSocket message string.
   */
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

  /**
   * Handles WebSocket errors and closes the connection.
   * @param event The error event.
   */
  private handleError(event: Event): void {
    console.error("Error from " + this.url);
    console.error(event);
    this.close();
  }

  /**
   * Handles WebSocket close events and notifies the connection handler.
   * @param event The close event.
   */
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

  /**
   * Returns the current connection status.
   * @returns True if connected, false otherwise.
   */
  isConnected(): boolean {
    return this.connected;
  }

  /**
   * Subscribes to one or more PVs.
   * @param pvs The PV name or array of PV names to subscribe to.
   */
  subscribe(pvs: string | string[]): void {
    if (!this.connected) return;
    if (!Array.isArray(pvs)) {
      pvs = [pvs];
    }
    console.log("subscribing", { type: "subscribe", pvs });
    this.socket.send(JSON.stringify({ type: "subscribe", pvs }));
  }

  /**
   * Unsubscribes from one or more PVs.
   * @param pvs The PV name or array of PV names to unsubscribe from.
   */
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

  /**
   * Writes a value to a PV.
   * @param pv The PV name.
   * @param value The value to write.
   */
  write(pv: string, value: number | string): void {
    if (!this.connected) return;
    this.socket.send(JSON.stringify({ type: "write", pv, value }));
  }

  /**
   * Closes the WebSocket connection.
   */
  close(): void {
    if (!this.connected) return;
    this.socket.close();
  }
}
