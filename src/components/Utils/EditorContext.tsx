import { useState, useMemo, useRef } from "react";
import type { Widget, PropertyKey, WidgetProperties, PropertyUpdates } from "../../types/widgets";
import type { Mode } from "../../shared/constants";
import { EDIT_MODE, GRID_ID } from "../../shared/constants";
import { GridZone } from "../../components/GridZone";
import { PVWSManager } from "../PVWS/PVWSManager";
import type { PVWSMessage } from "../../types/pvws";
import { EditorContext } from "./useEditorContext";

export interface EditorContextType {
  mode: Mode;
  setMode: (mode: Mode) => void;
  editorWidgets: Widget[];
  setEditorWidgets: React.Dispatch<React.SetStateAction<Widget[]>>;
  getWidget: (id: string) => Widget | undefined;
  updateWidget: (w: Widget) => void;
  updateWidgetProperties: (id: string, changes: PropertyUpdates) => void;
  selectedWidgetIDs: string[];
  setSelectedWidgetIDs: (ids: string[]) => void;
  writePVValue: (pv: string, newValue: number | string) => void;
  PVList: string[];
  propertyEditorFocused: boolean;
  setPropertyEditorFocused: React.Dispatch<React.SetStateAction<boolean>>;
  wdgSelectorOpen: boolean;
  setWdgSelectorOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [editorWidgets, setEditorWidgets] = useState<Widget[]>([GridZone]); // Grid is always present in the editor
  const [mode, updateMode] = useState<Mode>(EDIT_MODE);
  const [selectedWidgetIDs, setSelectedWidgetIDs] = useState<string[]>([]);
  const [propertyEditorFocused, setPropertyEditorFocused] = useState(false);
  const [wdgSelectorOpen, setWdgSelectorOpen] = useState(false);
  const PVWS = useRef<PVWSManager | null>(null);

  const setMode = (newMode: Mode) => {
    const isEdit = newMode == EDIT_MODE;
    if (isEdit) {
      PVWS.current?.stop();
      PVWS.current = null;
      clearPVValues();
    } else {
      setSelectedWidgetIDs([]);
      PVWS.current = new PVWSManager(updatePVValue);
      PVWS.current?.start(PVList);
    }
    updateWidgetProperties(GRID_ID, { gridLineVisible: isEdit });
    updateMode(newMode);
  };

  const getWidget = (id: string) => {
    return editorWidgets.find((w) => w.id === id);
  };

  const updateWidget = (updated: Widget) => {
    setEditorWidgets((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
  };

  const updateWidgetProperties = (id: string, changes: PropertyUpdates) => {
    setEditorWidgets((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w;

        const updatedProps: WidgetProperties = w.editableProperties;
        for (const [k, v] of Object.entries(changes as object)) {
          const propName = k as PropertyKey;
          if (!updatedProps[propName]) {
            console.warn(`tried updating inexistent property ${propName} on ${w.id}`);
            continue;
          }
          updatedProps[propName].value = v;
        }

        return {
          ...w,
          editableProperties: updatedProps,
        };
      })
    );
  };

  const updatePVValue = (msg: PVWSMessage) => {
    const pv = msg.pv;
    const newValue = msg.value;
    setEditorWidgets((prev) =>
      prev.map((w) => {
        if (w.editableProperties.pvName?.value !== pv) return w;
        return {
          ...w,
          pvValue: newValue,
        };
      })
    );
  };

  const writePVValue = (pv: string, newValue: number | string) => {
    PVWS.current?.writeToPV(pv, newValue);
  };

  const clearPVValues = () => {
    setEditorWidgets((prev) =>
      prev.map((w) => {
        if (!w.pvValue) return w;
        return {
          ...w,
          pvValue: undefined,
        };
      })
    );
  };

  const PVList = useMemo(() => {
    const set = new Set<string>();
    for (const w of editorWidgets) {
      if (w.editableProperties?.pvName) set.add(w.editableProperties.pvName.value);
    }
    return Array.from(set);
  }, [editorWidgets]);

  return (
    <EditorContext.Provider
      value={{
        editorWidgets,
        setEditorWidgets,
        updateWidget,
        getWidget,
        updateWidgetProperties,
        writePVValue,
        PVList,
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
