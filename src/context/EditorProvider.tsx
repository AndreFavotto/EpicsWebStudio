import type { Widget, PropertyUpdates } from "../types/widgets";
import type { Mode } from "../shared/constants";
import { EditorContext } from "./useEditorContext";
import { useWidgetManager } from "./useWidgetManager";
import usePVWS from "./usePVWS";
import useUIManager from "./useUIManager";

export interface EditorContextType {
  mode: Mode;
  setMode: (mode: Mode) => void;
  editorWidgets: Widget[];
  updateEditorWidgets: (newWidgets: Widget[] | ((prev: Widget[]) => Widget[])) => void;
  handleUndo: () => void;
  undoStack: Widget[][];
  handleRedo: () => void;
  redoStack: Widget[][];
  getWidget: (id: string) => Widget | undefined;
  updateWidget: (w: Widget) => void;
  updateWidgetProperties: (id: string, changes: PropertyUpdates) => void;
  selectedWidgetIDs: string[];
  selectedWidgets: Widget[];
  setSelectedWidgetIDs: (ids: string[]) => void;
  writePVValue: (pv: string, newValue: number | string) => void;
  PVList: string[];
  propertyEditorFocused: boolean;
  setPropertyEditorFocused: React.Dispatch<React.SetStateAction<boolean>>;
  wdgSelectorOpen: boolean;
  setWdgSelectorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  increaseZIndex: (id: string) => void;
  decreaseZIndex: (id: string) => void;
  setMaxZIndex: (id: string) => void;
  setMinZIndex: (id: string) => void;
}

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
