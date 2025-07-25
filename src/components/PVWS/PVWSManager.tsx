import { useEffect, useMemo, useRef } from "react";
import { PVWSClient } from "./PVWSClient";
import { useEditorContext } from "../Utils/EditorContext";
import * as CONSTS from "../../shared/constants";
import type { PVWSMessage } from "../../types/pvws";

export const PVWSManager: React.FC = () => {
  const { mode, editorWidgets, updateWidgetProperty } = useEditorContext();
  const clientRef = useRef<PVWSClient | null>(null);

  const pvs = useMemo(() => {
    const set = new Set<string>();
    for (const w of editorWidgets) {
      if (w.editableProperties?.pvName) set.add(w.editableProperties.pvName.value);
    }
    return Array.from(set);
  }, [editorWidgets]);

  // Connect only once when entering runtime mode
  useEffect(() => {
    const handleMessage = (msg: PVWSMessage) => {
      const { pv, value } = msg;
      editorWidgets.forEach((w) => {
        if (w.editableProperties?.pvName?.value === pv) {
          updateWidgetProperty(w.id, "pvValue", value!);
        }
      });
    };

    const handleConnect = (connected: boolean) => {
      if (connected) {
        clientRef.current?.subscribe(pvs);
      }
    };
    if (mode === CONSTS.RUNTIME_MODE && clientRef.current === null) {
      const client = new PVWSClient(CONSTS.PVWS_URL, handleConnect, handleMessage);
      client.open();
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
  }, [mode, pvs, editorWidgets, updateWidgetProperty]);

  return null;
};
