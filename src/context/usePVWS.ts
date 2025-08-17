import { useRef, useMemo } from "react";
import { PVWSManager } from "../components/PVWS/PVWSManager";
import type { PVWSMessage } from "../types/pvws";
import type { MultiWidgetPropertyUpdates } from "../types/widgets";
import type { useWidgetManager } from "./useWidgetManager";

export default function usePVWS(
  editorWidgets: ReturnType<typeof useWidgetManager>["editorWidgets"],
  batchWidgetUpdate: ReturnType<typeof useWidgetManager>["batchWidgetUpdate"]
) {
  const PVWS = useRef<PVWSManager | null>(null);

  const updatePVValue = (msg: PVWSMessage) => {
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

  const PVList = useMemo(() => {
    const set = new Set<string>();
    for (const w of editorWidgets) {
      if (w.editableProperties?.pvName) set.add(w.editableProperties.pvName.value);
      if (w.editableProperties?.xAxisPVName) set.add(w.editableProperties.xAxisPVName.value);
    }
    return Array.from(set);
  }, [editorWidgets]);

  return { PVWS, updatePVValue, writePVValue, clearPVValues, startNewSession, PVList };
}
