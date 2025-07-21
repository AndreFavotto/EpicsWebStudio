// EditorContext.tsx
import { createContext, useContext, useState, useMemo } from "react";
import type { Widget } from "../../types/widgets";
import type { Mode } from "../../shared/constants";
import * as CONSTS from "../../shared/constants";

type EditorContextType = {
  mode: Mode;
  setMode: (mode: Mode) => void;
  selectedWidget: Widget | null;
  selectWidget: (id: string | null) => void;
  updateWidget: (w: Widget) => void;
  updateWidgetProperty: (id: string, property: string, value: any) => void; 
  widgets: Widget[];
  setWidgets: React.Dispatch<React.SetStateAction<Widget[]>>;
  gridProps: Record<string, any>;
  updateGridProps: (props: Record<string, any>) => void;
  propertyEditorFocused: boolean;
  setPropertyEditorFocused: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [mode, setMode] = useState<Mode>(CONSTS.EDIT_MODE);
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);
  const [propertyEditorFocused, setPropertyEditorFocused] = useState(false);
  const [gridProps, setGridProps] = useState({
    size: 20,
    backgroundColor: CONSTS.DEFAULT_COLORS.backgroundColor,
    lineColor: CONSTS.DEFAULT_COLORS.gridLineColor,
  });
  const selectedWidget = useMemo(
    () => widgets.find(w => w.id === selectedWidgetId) || null,
    [widgets, selectedWidgetId]
  );

  /* Set a widget as selected */
  const selectWidget = (id: string | null) => {
    setSelectedWidgetId(id);
  };

  /* Update a specific property of a widget (all props) */
  const updateWidget = (updated: Widget) => {
    setWidgets(prev => prev.map(w => (w.id === updated.id ? updated : w)));
  };

  /* Update a specific property of a widget */
  const updateWidgetProperty = (id: string, property: string, value: any) => {
    setWidgets(prev => prev.map(w => {
      if (w.id !== id) return w;
      return {
        ...w,
        properties: {
          ...w.properties,
          [property]: value,
        }
      };
    }));
  };
  
  /* Update grid properties */
  const updateGridProps = (props: Record<string, any>) => {
    setGridProps(prev => ({ ...prev, ...props }));
  };

  return (
    <EditorContext.Provider value={{
      widgets,
      setWidgets,
      updateWidget,
      updateWidgetProperty,
      selectedWidget,
      selectWidget,
      mode,
      setMode,
      gridProps,
      updateGridProps,
      propertyEditorFocused,
      setPropertyEditorFocused,
    }}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditorContext = () => {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("EditorContext not found");
  return ctx;
};
