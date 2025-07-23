import { createContext, useContext, useState, useMemo } from "react";
import type { Widget } from "../../types/widgets";
import type { Mode } from "../../shared/constants";
import * as CONSTS from "../../shared/constants";

type EditorContextType = {
  mode: Mode;
  setMode: (mode: Mode) => void;
  selectedWidgets: Widget[];
  setSelectedWidgets: (ids: string[]) => void;
  updateWidget: (w: Widget) => void;
  updateWidgetProperty: (id: string, property: string, value: any) => void;
  editorWidgets: Widget[];
  setEditorWidgets: React.Dispatch<React.SetStateAction<Widget[]>>;
  gridProps: Record<string, any>;
  updateGridProps: (props: Record<string, any>) => void;
  propertyEditorFocused: boolean;
  setPropertyEditorFocused: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [editorWidgets, setEditorWidgets] = useState<Widget[]>([]);
  const [mode, setMode] = useState<Mode>(CONSTS.EDIT_MODE);
  const [selectedWidgetIds, setSelectedWidgetIds] = useState<string[]>([]);
  const [propertyEditorFocused, setPropertyEditorFocused] = useState(false);
  const [gridProps, setGridProps] = useState({
    size: 20,
    backgroundColor: CONSTS.DEFAULT_COLORS.backgroundColor,
    lineColor: CONSTS.DEFAULT_COLORS.gridLineColor,
  });

  const selectedWidgets = useMemo(
    () => editorWidgets.filter((w) => selectedWidgetIds.includes(w.id)),
    [editorWidgets, selectedWidgetIds]
  );

  const setSelectedWidgets = (ids: string[]) => {
    // Remove 'selected' class from previously selected widgets
    console.log("Setting selected widgets:", ids);
    selectedWidgetIds.forEach((prevId) => {
      if (!ids.includes(prevId)) {
        document.getElementById(prevId)?.classList.remove("selected");
        console.log(`Widget ${prevId} deselected`);
      }
    });
    // Add 'selected' class to newly selected widgets
    ids.forEach((id) => {
      if (!selectedWidgetIds.includes(id)) {
        document.getElementById(id)?.classList.add("selected");
        console.log(`Widget ${id} selected`);
      }
    });
    setSelectedWidgetIds(ids);
  };

  const updateWidget = (updated: Widget) => {
    setEditorWidgets((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
  };

  const updateWidgetProperty = (id: string, property: string, value: any) => {
    setEditorWidgets((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w;
        return {
          ...w,
          properties: {
            ...w.properties,
            [property]: value,
          },
        };
      })
    );
  };

  const updateGridProps = (props: Record<string, any>) => {
    setGridProps((prev) => ({ ...prev, ...props }));
  };

  return (
    <EditorContext.Provider
      value={{
        editorWidgets,
        setEditorWidgets,
        updateWidget,
        updateWidgetProperty,
        selectedWidgets,
        setSelectedWidgets,
        mode,
        setMode,
        gridProps,
        updateGridProps,
        propertyEditorFocused,
        setPropertyEditorFocused,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export const useEditorContext = () => {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("EditorContext not found");
  return ctx;
};
