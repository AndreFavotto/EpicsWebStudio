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
  // use "cache" to store metadata
  const pvCache = useRef<Record<string, PVData>>({});

  const onMessage = (msg: WSMessage) => {
    if (!PVList.includes(msg.pv)) {
      console.warn(`received message from unsolicited PV: ${msg.pv}`);
      return;
    }

    const prev = pvCache.current[msg.pv] ?? {};
    const pvData: PVData = {
      pv: msg.pv,
      value: msg.value ?? prev.value,
      alarm: msg.alarm ?? prev.alarm,
      timeStamp: msg.timeStamp ?? prev.timeStamp,
      display: prev.display ?? msg.display, // sent only on first update
      control: prev.control ?? msg.control, // sent only on first update
      valueAlarm: prev.valueAlarm ?? msg.valueAlarm, // sent only on first update
    };
    pvCache.current[msg.pv] = pvData;
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
