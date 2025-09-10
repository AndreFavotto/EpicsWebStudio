import React from "react";
import { EditorContext } from "./useEditorContext";
import { useWidgetManager } from "./useWidgetManager";
import usePvaPyWS from "./usePvaPyWS";
import useUIManager from "./useUIManager";

/**
 * The full editor context type.
 */
export type EditorContextType = ReturnType<typeof useWidgetManager> &
  ReturnType<typeof usePvaPyWS> &
  ReturnType<typeof useUIManager>;

/**
 * EditorProvider component.
 *
 * Wraps the application with a React context that provides:
 * - Widget management (creation, selection, property updates, PV binding)
 * - WebSocket connection to EPICS PVs (subscribe, write, lifecycle handling)
 * - UI management (edit vs. runtime mode, property editor focus, widget selector state)
 *
 * This provider is required for any component that calls `useEditorContext`.
 *
 * @component
 */
export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const widgetManager = useWidgetManager();
  const ws = usePvaPyWS(widgetManager.PVList, widgetManager.updatePVData);
  const ui = useUIManager(
    ws.ws,
    ws.startNewSession,
    widgetManager.clearPVData,
    widgetManager.editorWidgets,
    widgetManager.setSelectedWidgetIDs,
    widgetManager.updateWidgetProperties,
    widgetManager.loadWidgets
  );

  // Memoize context value
  const value = React.useMemo<EditorContextType>(
    () => ({
      ...widgetManager,
      ...ws,
      ...ui,
    }),
    [widgetManager, ws, ui]
  );

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
};
