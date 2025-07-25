import { toByteArray } from "./base64";
import type { PVWSMessage } from "../../types/widgets";

type ConnectHandler = (connected: boolean) => void;
type MessageHandler = (message: PVWSMessage) => void;

export class PVWSClient {
  private url: string;
  private connect_handler: ConnectHandler;
  private message_handler: MessageHandler;

  private socket!: WebSocket;
  private idle = true;
  private idle_timer: ReturnType<typeof setInterval> | null = null;

  private values: Record<string, PVWSMessage> = {};

  reconnect_ms = 10000;
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
        const bytes = toByteArray(jm.b64dbl as string);
        jm.value = Array.from(new Float64Array(bytes.buffer));
        delete jm.b64dbl;
      } else if (jm.b64flt !== undefined) {
        const bytes = toByteArray(jm.b64flt as string);
        jm.value = Array.from(new Float32Array(bytes.buffer));
        delete jm.b64flt;
      } else if (jm.b64srt !== undefined) {
        const bytes = toByteArray(jm.b64srt as string);
        jm.value = Array.from(new Int16Array(bytes.buffer));
        delete jm.b64srt;
      } else if (jm.b64int !== undefined) {
        const bytes = toByteArray(jm.b64int as string);
        jm.value = Array.from(new Int32Array(bytes.buffer));
        delete jm.b64int;
      } else if (jm.b64byt !== undefined) {
        const bytes = toByteArray(jm.b64byt as string);
        jm.value = Array.from(new Uint8Array(bytes.buffer));
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
    this.stopIdleCheck();
    this.connect_handler(false);
    let message = `Web socket closed (${event.code}`;
    if (event.reason) {
      message += `, ${event.reason}`;
    }
    message += ")";
    console.log(message);
    console.log(`Scheduling re-connect to ${this.url} in ${this.reconnect_ms}ms`);
    setTimeout(() => this.open(), this.reconnect_ms);
  }

  ping(): void {
    this.socket.send(JSON.stringify({ type: "ping" }));
  }

  subscribe(pvs: string | string[]): void {
    if (!Array.isArray(pvs)) {
      pvs = [pvs];
    }
    this.socket.send(JSON.stringify({ type: "subscribe", pvs }));
  }

  clear(pvs: string | string[]): void {
    if (!Array.isArray(pvs)) {
      pvs = [pvs];
    }
    this.socket.send(JSON.stringify({ type: "clear", pvs }));

    for (const pv of pvs) {
      delete this.values[pv];
    }
  }

  list(): void {
    this.socket.send(JSON.stringify({ type: "list" }));
  }

  write(pv: string, value: number | string): void {
    this.socket.send(JSON.stringify({ type: "write", pv, value }));
  }

  close(): void {
    this.stopIdleCheck();
    this.socket.close();
  }
}
