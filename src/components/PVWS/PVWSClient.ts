import { base64ToArrayBuffer } from "./base64";
import type { PVWSMessage } from "../../types/pvws";

type ConnectHandler = (connected: boolean) => void;
type MessageHandler = (message: PVWSMessage) => void;

export class PVWSClient {
  private url: string;
  private connect_handler: ConnectHandler;
  private message_handler: MessageHandler;

  private connected = false;
  private socket!: WebSocket;
  private idle = true;
  private idle_timer: ReturnType<typeof setInterval> | null = null;

  private values: Record<string, PVWSMessage> = {};

  reconnect_ms = 5000;
  idle_check_ms = 30000;

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
    this.idle_timer ??= setInterval(() => this.checkIdleTimeout(), this.idle_check_ms);
  }

  private checkIdleTimeout(): void {
    if (this.idle) {
      this.ping();
    } else {
      this.idle = true;
    }
  }

  private stopIdleCheck(): void {
    if (this.idle_timer != null) {
      clearInterval(this.idle_timer);
    }
    this.idle_timer = null;
  }

  private handleMessage(message: string): void {
    this.idle = false;
    function isPVWSMessage(obj: unknown): obj is PVWSMessage {
      return typeof obj === "object" && obj !== null && ("pv" in obj || "value" in obj);
    }

    const uncheckedMessage: unknown = JSON.parse(message);

    if (!isPVWSMessage(uncheckedMessage)) {
      console.error("Received invalid message:", message);
      return;
    }

    // at this point, trust the message is a PVWSMessage
    const jm = uncheckedMessage;

    if (jm.type === "update") {
      if (jm.b64dbl !== undefined) {
        jm.value = Array.from(new Float64Array(base64ToArrayBuffer(jm.b64dbl)));
        delete jm.b64dbl;
      } else if (jm.b64flt !== undefined) {
        jm.value = Array.from(new Float32Array(base64ToArrayBuffer(jm.b64flt)));
        delete jm.b64flt;
      } else if (jm.b64srt !== undefined) {
        jm.value = Array.from(new Int16Array(base64ToArrayBuffer(jm.b64srt)));
        delete jm.b64srt;
      } else if (jm.b64int !== undefined) {
        jm.value = Array.from(new Int32Array(base64ToArrayBuffer(jm.b64int)));
        delete jm.b64int;
      } else if (jm.b64byt !== undefined) {
        jm.value = Array.from(new Uint8Array(base64ToArrayBuffer(jm.b64byt)));
        delete jm.b64byt;
      }

      let value = this.values[jm.pv ?? ""];

      value ??= { pv: jm.pv, type: "update", readonly: true };

      Object.assign(value, jm);
      this.values[jm.pv ?? ""] = value;
      this.message_handler(value);
    } else {
      this.message_handler(jm);
    }
  }

  private handleError(event: Event): void {
    console.error("Error from " + this.url);
    console.error(event);
    this.close();
  }

  private handleClose(event: CloseEvent): void {
    this.connected = false;
    this.stopIdleCheck();
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

  ping(): void {
    this.socket.send(JSON.stringify({ type: "ping" }));
  }

  subscribe(pvs: string | string[]): void {
    if (!this.connected) return;
    if (!Array.isArray(pvs)) {
      pvs = [pvs];
    }
    console.log("subscribing", { type: "subscribe", pvs });
    this.socket.send(JSON.stringify({ type: "subscribe", pvs }));
  }

  clear(pvs: string | string[]): void {
    if (!this.connected) return;
    if (!Array.isArray(pvs)) {
      pvs = [pvs];
    }
    this.socket.send(JSON.stringify({ type: "clear", pvs }));

    for (const pv of pvs) {
      delete this.values[pv];
    }
  }

  list(): void {
    if (!this.connected) return;
    this.socket.send(JSON.stringify({ type: "list" }));
  }

  write(pv: string, value: number | string): void {
    if (!this.connected) return;
    this.socket.send(JSON.stringify({ type: "write", pv, value }));
  }

  close(): void {
    if (!this.connected) return;
    this.stopIdleCheck();
    this.socket.close();
  }
}
