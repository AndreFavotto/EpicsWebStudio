import { PVWSClient } from "./PVWSClient";
import * as CONSTS from "../../constants/constants";
import type { PVWSMessage } from "../../types/pvws";

export class PVWSManager {
  private client: PVWSClient | null = null;
  private PVList: string[] = [];
  private handleMessage: (msg: PVWSMessage) => void;

  constructor(handleMessage: (msg: PVWSMessage) => void) {
    this.handleMessage = handleMessage;
  }

  private handleConnect = (connected: boolean) => {
    if (connected) {
      this.client?.subscribe(this.PVList);
    }
  };

  start(PVList: string[]): void {
    this.PVList = PVList;
    if (this.client) return;
    this.client = new PVWSClient(CONSTS.PVWS_URL, this.handleConnect, this.handleMessage);
    this.client.open();
  }

  stop(): void {
    if (!this.client) return;
    this.client.clear(this.PVList);
    this.client.close();
    this.client = null;
  }

  writeToPV(pv: string, value: string | number): void {
    if (!this.client?.isConnected()) return;
    this.client.write(pv, value);
  }

  isConnected(): boolean {
    return this.client?.isConnected() ?? false;
  }
}
