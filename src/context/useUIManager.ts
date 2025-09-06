import { useState } from "react";
import usePvaPyWS from "./usePvaPyWS";
import { EDIT_MODE, GRID_ID, type Mode } from "../constants/constants";
import { useWidgetManager } from "./useWidgetManager";

/**
 * Hook that manages global UI state such as editor mode,
 * widget selector panel, and property editor focus.
 *
 * It also coordinates session lifecycle when switching between
 * edit and runtime modes.
 */
export default function useUIManager(
  ws: ReturnType<typeof usePvaPyWS>["ws"],
  clearPVValues: () => void,
  startNewSession: () => void,
  setSelectedWidgetIDs: ReturnType<typeof useWidgetManager>["setSelectedWidgetIDs"],
  updateWidgetProperties: ReturnType<typeof useWidgetManager>["updateWidgetProperties"]
) {
  const [propertyEditorFocused, setPropertyEditorFocused] = useState(false);
  const [wdgSelectorOpen, setWdgSelectorOpen] = useState(false);
  const [mode, setMode] = useState<Mode>(EDIT_MODE);

  /**
   * Switch between edit and runtime modes.
   * - In edit mode: closes WS session, clears PV values.
   * - In runtime mode: clears selection, closes widget selector and starts a new WS session.
   *
   * Also updates the grid visibility property (not visible in runtime).
   *
   * @param newMode The new mode to set ("edit" | "runtime")
   */
  const updateMode = (newMode: Mode) => {
    const isEdit = newMode == EDIT_MODE;
    if (isEdit) {
      ws.current?.close();
      ws.current = null;
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
