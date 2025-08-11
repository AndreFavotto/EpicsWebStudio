import { useState } from "react";
import usePVWS from "./usePVWS";
import { EDIT_MODE, GRID_ID, type Mode } from "../shared/constants";
import { useWidgetManager } from "./useWidgetManager";

export default function useUIManager(
  PVWS: ReturnType<typeof usePVWS>["PVWS"],
  clearPVValues: () => void,
  startNewSession: () => void,
  setSelectedWidgetIDs: ReturnType<typeof useWidgetManager>["setSelectedWidgetIDs"],
  updateWidgetProperties: ReturnType<typeof useWidgetManager>["updateWidgetProperties"]
) {
  const [propertyEditorFocused, setPropertyEditorFocused] = useState(false);
  const [wdgSelectorOpen, setWdgSelectorOpen] = useState(false);
  const [mode, setMode] = useState<Mode>(EDIT_MODE);

  const updateMode = (newMode: Mode) => {
    const isEdit = newMode == EDIT_MODE;
    if (isEdit) {
      PVWS.current?.stop();
      PVWS.current = null;
      clearPVValues();
    } else {
      setSelectedWidgetIDs([]);
      setWdgSelectorOpen(false);
      startNewSession();
    }
    updateWidgetProperties(GRID_ID, { gridLineVisible: isEdit }, false);
    setMode(newMode);
  };

  return {
    propertyEditorFocused,
    setPropertyEditorFocused,
    mode,
    updateMode,
    wdgSelectorOpen,
    setWdgSelectorOpen,
  };
}
