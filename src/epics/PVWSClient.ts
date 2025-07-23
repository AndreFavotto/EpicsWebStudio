type MessageCallback = (msg: any) => void;
type ConnectCallback = () => void;

export class PVWSClient {
  private socket: WebSocket | null = null;
  private onMessageCb: MessageCallback | null = null;
  private onConnectCb?: ConnectCallback | null = null;
  private connected = false;

  connect(url: string, onMessage: MessageCallback, onConnect?: ConnectCallback) {
    this.onMessageCb = onMessage;
    this.onConnectCb = onConnect;
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log("Connected to PVWS server");
      this.connected = true;
      this.onConnectCb?.();
    };

    this.socket.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        this.onMessageCb?.(msg);
      } catch {}
    };

    this.socket.onclose = () => {
      this.connected = false;
      this.socket = null;
    };
  }

  subscribe(pvs: string[]) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type: "subscribe", pvs }));
    }
  }

  unsubscribe(pvs: string[]) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type: "clear", pvs }));
    }
  }

  isConnected() {
    return this.connected;
  }

  close() {
    this.socket?.close();
    this.socket = null;
    this.connected = false;
  }
}
