import { useEffect, useMemo, useRef } from "react";
import { PVWSClient } from "../../epics/PVWSClient";
import { useEditorContext } from "./EditorContext";
import * as CONSTS from "../../shared/constants";

export const PVWSManager: React.FC = () => {
  const { mode, editorWidgets, updateWidgetProperty } = useEditorContext();
  const clientRef = useRef<PVWSClient | null>(null);

  const pvs = useMemo(() => {
    const set = new Set<string>();
    for (const w of editorWidgets) {
      if (w.properties?.pv) set.add(w.properties.pv);
    }
    return Array.from(set);
  }, [editorWidgets]);

  const handleMessage = (msg: any) => {
    const { pvName, value } = msg;
    editorWidgets.forEach((w) => {
      if (w.properties?.pv === pvName) {
        updateWidgetProperty(w.id, "pvValue", value);
      }
    });
  };

  // Connect only once when entering runtime mode
  useEffect(() => {
    if (mode === CONSTS.RUNTIME_MODE && clientRef.current === null) {
      const client = new PVWSClient();
      clientRef.current = client;
      client.connect(CONSTS.PVWS_URL, handleMessage, () => {
        client.subscribe(pvs);
      });
    }

    // Cleanup on exit from runtime mode
    return () => {
      if (mode !== CONSTS.RUNTIME_MODE) {
        clientRef.current?.unsubscribe(pvs);
        clientRef.current?.close();
        clientRef.current = null;
      }
    };
  }, [mode]);

  // Subscribe to new PVs only when the list changes, without reconnecting
  useEffect(() => {
    if (mode === CONSTS.RUNTIME_MODE && clientRef.current?.isConnected()) {
      clientRef.current.subscribe(pvs);
    }
  }, [pvs]);

  return null;
};
