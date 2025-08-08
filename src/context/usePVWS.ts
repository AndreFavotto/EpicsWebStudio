import { useRef, useMemo } from "react";
import { PVWSManager } from "../components/PVWS/PVWSManager";
import type { PVWSMessage } from "../types/pvws";
import { useWidgetManager } from "./useWidgetManager";

export default function usePVWS() {
  const PVWS = useRef<PVWSManager | null>(null);
  const { editorWidgets, updateEditorWidgets, setEditorWidgets } = useWidgetManager();

  const updatePVValue = (msg: PVWSMessage) => {
    const pv = msg.pv;
    const newValue = msg.value;
    updateEditorWidgets((prev) =>
      prev.map((w) => {
        if (w.editableProperties.pvName?.value !== pv) return w;
        return {
          ...w,
          pvValue: newValue,
        };
      })
    );
  };

  const startNewSession = () => {
    if (PVWS.current) {
      PVWS.current.stop();
    }
    PVWS.current = new PVWSManager(updatePVValue);
    PVWS.current?.start(PVList);
  };

  const writePVValue = (pv: string, newValue: number | string) => {
    PVWS.current?.writeToPV(pv, newValue);
  };

  const clearPVValues = () => {
    setEditorWidgets((prev) =>
      prev.map((w) => {
        if (!w.pvValue) return w;
        return {
          ...w,
          pvValue: undefined,
        };
      })
    );
  };

  const PVList = useMemo(() => {
    const set = new Set<string>();
    for (const w of editorWidgets) {
      if (w.editableProperties?.pvName) set.add(w.editableProperties.pvName.value);
    }
    return Array.from(set);
  }, [editorWidgets]);

  return { PVWS, updatePVValue, writePVValue, clearPVValues, startNewSession, PVList };
}
