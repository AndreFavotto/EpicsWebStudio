import { EditorContext } from "./useEditorContext";
import { useWidgetManager } from "./useWidgetManager";
import usePvaPyWS from "./usePvaPyWS";
import useUIManager from "./useUIManager";

export type EditorContextType = ReturnType<typeof useWidgetManager> &
  ReturnType<typeof usePvaPyWS> &
  ReturnType<typeof useUIManager>;

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const widgetManager = useWidgetManager();
  const ws = usePvaPyWS(widgetManager.PVList, widgetManager.updatePVData);
  const ui = useUIManager(
    ws.ws,
    widgetManager.clearPVData,
    ws.startNewSession,
    widgetManager.setSelectedWidgetIDs,
    widgetManager.updateWidgetProperties
  );

  const value: EditorContextType = {
    ...widgetManager,
    ...ws,
    ...ui,
  };
  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
};
