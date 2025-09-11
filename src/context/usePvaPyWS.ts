import { useCallback, useRef, useState } from "react";
import { WSClient } from "../WSClient/WSClient";
import type { PVData, WSMessage } from "../types/pvaPyWS";
import type { useWidgetManager } from "./useWidgetManager";
import { WS_URL } from "../constants/constants";

/**
 * Hook that manages a WebSocket session to the PV WebSocket.
 *
 * - Handles subscribing/unsubscribing PVs
 * - Caches metadata that is sent only once
 * - Forwards processed PVData updates back to the widget manager
 *
 * @param PVList List of PVs to subscribe to
 * @param updatePVData Callback to update PV data in the widget manager
 */
export default function usePvaPyWS(
  PVList: ReturnType<typeof useWidgetManager>["PVList"],
  updatePVData: ReturnType<typeof useWidgetManager>["updatePVData"]
) {
  /** WebSocket client instance */
  const ws = useRef<WSClient | null>(null);
  const [isWSConnected, setWSConnected] = useState(false);
  const pvCache = useRef<Record<string, PVData>>({});

  /**
   * Handles incoming WebSocket messages.
   * - Filters unsolicited PVs
   * - Merges new values with cached metadata
   * - Forwards updates to widget manager
   *
   * @param msg Message received from the PV WebSocket
   */
  const onMessage = useCallback(
    (msg: WSMessage) => {
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
        display: prev.display ?? msg.display,
        control: prev.control ?? msg.control,
        valueAlarm: prev.valueAlarm ?? msg.valueAlarm,
      };
      pvCache.current[msg.pv] = pvData;
      updatePVData(pvData);
    },
    [PVList, updatePVData]
  );

  /**
   * Handles connection state changes.
   * Subscribes to PV list when connected.
   *
   * @param connected Whether the WS connection is active
   */
  const handleConnect = useCallback(
    (connected: boolean) => {
      setWSConnected(connected);
      if (connected) {
        ws.current?.subscribe(PVList);
      }
    },
    [setWSConnected, PVList]
  );

  /**
   * Starts a new WebSocket session.
   * Closes an existing session if one is active.
   */
  const startNewSession = useCallback(() => {
    if (ws.current) {
      ws.current.unsubscribe(PVList);
      ws.current.close();
      ws.current = null;
    }
    ws.current = new WSClient(WS_URL, handleConnect, onMessage);
    ws.current.open();
  }, [PVList, handleConnect, onMessage]);

  /**
   * Writes a new value to a PV.
   *
   * @param pv Name of the PV
   * @param newValue Value to write
   */
  const writePVValue = useCallback((pv: string, newValue: number | string) => {
    ws.current?.write(pv, newValue);
  }, []);

  /**
   * Stops the current WebSocket session.
   * Unsubscribes PVs, closes the connection, clears state.
   */
  const stopSession = useCallback(() => {
    if (!ws.current) return;
    ws.current.unsubscribe(PVList);
    ws.current.close();
    ws.current = null;
    setWSConnected(false);
  }, [setWSConnected, PVList]);

  return {
    ws,
    PVList,
    isWSConnected,
    startNewSession,
    stopSession,
    writePVValue,
  };
}
