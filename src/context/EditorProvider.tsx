import { EditorContext } from "./useEditorContext";
import { useWidgetManager } from "./useWidgetManager";
import usePVWS from "./usePVWS";
import useUIManager from "./useUIManager";

export type EditorContextType = ReturnType<typeof useWidgetManager> &
  ReturnType<typeof usePVWS> &
  ReturnType<typeof useUIManager>;

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const widgetManager = useWidgetManager();
  const pvws = usePVWS(widgetManager.editorWidgets, widgetManager.batchWidgetUpdate);
  const ui = useUIManager(
    pvws.PVWS,
    pvws.clearPVValues,
    pvws.startNewSession,
    widgetManager.setSelectedWidgetIDs,
    widgetManager.updateWidgetProperties
  );

  const value: EditorContextType = {
    ...widgetManager,
    ...pvws,
    ...ui,
  };
  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
};
