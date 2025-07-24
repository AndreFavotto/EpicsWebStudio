import { useEffect, useMemo, useRef } from "react";
import { PVWSClient } from "./PVWSClient";
import { useEditorContext } from "../Utils/EditorContext";
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

  const handleConnect = (connected: boolean) => {
    if (connected) {
      clientRef.current?.subscribe(pvs);
    }
  };

  // Connect only once when entering runtime mode
  useEffect(() => {
    if (mode === CONSTS.RUNTIME_MODE && clientRef.current === null) {
      const client = new PVWSClient(CONSTS.PVWS_URL, handleConnect, handleMessage);
      clientRef.current = client;
    }

    // Cleanup on exit from runtime mode
    return () => {
      if (mode !== CONSTS.RUNTIME_MODE) {
        clientRef.current?.clear(pvs);
        clientRef.current?.close();
        clientRef.current = null;
      }
    };
  }, [mode]);

  return null;
};
