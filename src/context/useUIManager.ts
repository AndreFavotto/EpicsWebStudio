import { useState } from "react";
import usePVWS from "./usePVWS";
import { EDIT_MODE, GRID_ID, type Mode } from "../shared/constants";
import { useWidgetManager } from "./useWidgetManager";

export default function useUIManager() {
  const [propertyEditorFocused, setPropertyEditorFocused] = useState(false);
  const [wdgSelectorOpen, setWdgSelectorOpen] = useState(false);
  const [mode, updateMode] = useState<Mode>(EDIT_MODE);
  const { PVWS, clearPVValues, startNewSession } = usePVWS();
  const { setSelectedWidgetIDs, updateWidgetProperties } = useWidgetManager();

  const setMode = (newMode: Mode) => {
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
    updateWidgetProperties(GRID_ID, { gridLineVisible: isEdit });
    updateMode(newMode);
  };

  return {
    propertyEditorFocused,
    setPropertyEditorFocused,
    mode,
    setMode,
    wdgSelectorOpen,
    setWdgSelectorOpen,
  };
}
