import { useRef, useMemo, useState } from "react";
import { WSClient } from "../WSClient/WSClient";
import type { WSMessage } from "../types/pvaPyWS";
import type { MultiWidgetPropertyUpdates } from "../types/widgets";
import type { useWidgetManager } from "./useWidgetManager";
import { WS_URL } from "../constants/constants";

export default function usePvaPyWS(
  editorWidgets: ReturnType<typeof useWidgetManager>["editorWidgets"],
  batchWidgetUpdate: ReturnType<typeof useWidgetManager>["batchWidgetUpdate"]
) {
  const ws = useRef<WSClient | null>(null);
  const PVList = useMemo(() => {
    const set = new Set<string>();
    for (const w of editorWidgets) {
      if (w.editableProperties?.pvName?.value) set.add(w.editableProperties.pvName.value);
      if (w.editableProperties?.xAxisPVName?.value) set.add(w.editableProperties.xAxisPVName.value);
    }
    return Array.from(set);
  }, [editorWidgets]);

  const [isWSConnected, setWSConnected] = useState(false);

  const updatePVValue = (msg: WSMessage) => {
    const pv = msg.pv;
    const newValue = msg.value;

    const updates: MultiWidgetPropertyUpdates = {};
    editorWidgets.forEach((w) => {
      if (w.editableProperties.pvName?.value === pv) {
        updates[w.id] = { pvValue: newValue };
      } else if (w.editableProperties.xAxisPVName?.value === pv) {
        updates[w.id] = { xAxisPVValue: newValue };
      }
    });

    if (Object.keys(updates).length > 0) {
      batchWidgetUpdate(updates, false);
    }
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
    ws.current = new WSClient(WS_URL, handleConnect, updatePVValue);
    ws.current.open();
  };

  const writePVValue = (pv: string, newValue: number | string) => {
    ws.current?.write(pv, newValue);
  };

  const clearPVValues = () => {
    const updates: MultiWidgetPropertyUpdates = {};
    editorWidgets.forEach((w) => {
      if (w.editableProperties.pvValue !== undefined) {
        updates[w.id] = { pvValue: undefined };
      }
      if (w.editableProperties.xAxisPVValue !== undefined) {
        updates[w.id] = { xAxisPVValue: undefined };
      }
    });
    batchWidgetUpdate(updates, false);
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
    clearPVValues,
  };
}
