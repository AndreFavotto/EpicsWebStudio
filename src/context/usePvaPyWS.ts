import { useRef, useState } from "react";
import { WSClient } from "../WSClient/WSClient";
import type { PVData, WSMessage } from "../types/pvaPyWS";
import type { useWidgetManager } from "./useWidgetManager";
import { WS_URL } from "../constants/constants";

export default function usePvaPyWS(
  PVList: ReturnType<typeof useWidgetManager>["PVList"],
  updatePVData: ReturnType<typeof useWidgetManager>["updatePVData"]
) {
  const ws = useRef<WSClient | null>(null);
  const [isWSConnected, setWSConnected] = useState(false);

  const parseWSMessage = (msg: WSMessage): PVData => {
    return {
      pv: msg.pv,
      value: msg.value ?? "",
      alarm: msg.alarm,
      timeStamp: msg.timeStamp,
      display: msg.display,
      control: msg.control,
      valueAlarm: msg.valueAlarm,
    };
  };

  const onMessage = (msg: WSMessage) => {
    if (!PVList.includes(msg.pv)) {
      console.warn(`received message from unsolicited PV: ${msg.pv}`);
      return;
    }
    const pvData = parseWSMessage(msg);
    updatePVData(pvData);
  };

  const handleConnect = (connected: boolean) => {
    setWSConnected(connected);
    if (connected) {
      ws.current?.subscribe(PVList);
    }
  };

  const startNewSession = () => {
    if (ws.current) {
      ws.current.unsubscribe(PVList);
      ws.current.close();
      ws.current = null;
    }
    ws.current = new WSClient(WS_URL, handleConnect, onMessage);
    ws.current.open();
  };

  const writePVValue = (pv: string, newValue: number | string) => {
    ws.current?.write(pv, newValue);
  };

  const stopSession = () => {
    if (!ws.current) return;
    ws.current.unsubscribe(PVList);
    ws.current.close();
    ws.current = null;
    setWSConnected(false);
  };

  return {
    ws,
    PVList,
    isWSConnected,
    startNewSession,
    stopSession,
    writePVValue,
  };
}
