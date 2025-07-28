import { createContext, useContext, useState } from "react";
import type { Widget, PropertyKey, PropertyValue } from "../../types/widgets";
import { PROPERTY_SCHEMAS } from "../../types/widgets";
import type { Mode } from "../../shared/constants";
import * as CONSTS from "../../shared/constants";
import { GridZone } from "../../components/GridZone";

interface EditorContextType {
  mode: Mode;
  setMode: (mode: Mode) => void;
  selectedWidgetIDs: string[];
  setSelectedWidgetIDs: (ids: string[]) => void;
  updateWidget: (w: Widget) => void;
  updateWidgetProperty: (id: string, propName: PropertyKey, newValue: PropertyValue) => void;
  editorWidgets: Widget[];
  setEditorWidgets: React.Dispatch<React.SetStateAction<Widget[]>>;
  propertyEditorFocused: boolean;
  setPropertyEditorFocused: React.Dispatch<React.SetStateAction<boolean>>;
  wdgSelectorOpen: boolean;
  setWdgSelectorOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [editorWidgets, setEditorWidgets] = useState<Widget[]>([GridZone]); // Grid is always present in the editor
  const [mode, updateMode] = useState<Mode>(CONSTS.EDIT_MODE);
  const [selectedWidgetIDs, setSelectedWidgets] = useState<string[]>([]);
  const [propertyEditorFocused, setPropertyEditorFocused] = useState(false);
  const [wdgSelectorOpen, setWdgSelectorOpen] = useState(false);

  const setMode = (newMode: Mode) => {
    updateWidgetProperty("grid", "gridLineVisible", newMode == CONSTS.EDIT_MODE);
    updateMode(newMode);
  };

  const setSelectedWidgetIDs = (ids: string[]) => {
    selectedWidgetIDs.forEach((prevId) => {
      if (!ids.includes(prevId)) {
        document.getElementById(prevId)?.classList.remove("selected");
      }
    });
    ids.forEach((id) => {
      if (!selectedWidgetIDs.includes(id)) {
        document.getElementById(id)?.classList.add("selected");
      }
    });
    setSelectedWidgets(ids);
  };

  const updateWidget = (updated: Widget) => {
    setEditorWidgets((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
  };

  const updateWidgetProperty = (id: string, propName: PropertyKey, newValue: PropertyValue) => {
    setEditorWidgets((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w;

        const current = w.editableProperties[propName] ?? PROPERTY_SCHEMAS[propName];

        return {
          ...w,
          editableProperties: {
            ...w.editableProperties,
            [propName]: {
              ...current,
              value: newValue,
            },
          },
        };
      })
    );
  };

  return (
    <EditorContext.Provider
      value={{
        editorWidgets,
        setEditorWidgets,
        updateWidget,
        updateWidgetProperty,
        selectedWidgetIDs,
        setSelectedWidgetIDs,
        mode,
        setMode,
        propertyEditorFocused,
        setPropertyEditorFocused,
        wdgSelectorOpen,
        setWdgSelectorOpen,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useEditorContext = () => {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("EditorContext not found");
  return ctx;
};
