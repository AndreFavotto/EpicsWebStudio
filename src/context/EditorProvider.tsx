import { EditorContext } from "./useEditorContext";
import { useWidgetManager } from "./useWidgetManager";
import usePVWS from "./usePVWS";
import useUIManager from "./useUIManager";

export type EditorContextType = ReturnType<typeof useWidgetManager> &
  ReturnType<typeof usePVWS> &
  ReturnType<typeof useUIManager>;

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const widgetManager = useWidgetManager();
  const pvws = usePVWS();
  const ui = useUIManager();

  const value: EditorContextType = {
    ...widgetManager,
    ...pvws,
    ...ui,
  };
  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
};
