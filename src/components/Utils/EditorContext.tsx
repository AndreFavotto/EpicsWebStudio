import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import type { Widget, PropertyKey, WidgetProperties, PropertyUpdates } from "../../types/widgets";
import type { Mode } from "../../shared/constants";
import { EDIT_MODE, GRID_ID, MAX_HISTORY } from "../../shared/constants";
import { GridZone } from "../../components/GridZone";
import { PVWSManager } from "../PVWS/PVWSManager";
import type { PVWSMessage } from "../../types/pvws";
import { EditorContext } from "./useEditorContext";

function deepCloneWidgets(widgets: Widget[]): Widget[] {
  return widgets.map((widget) => ({
    ...widget,
    editableProperties: Object.fromEntries(Object.entries(widget.editableProperties).map(([k, v]) => [k, { ...v }])),
  }));
}

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
}

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [editorWidgets, setEditorWidgets] = useState<Widget[]>([GridZone]); // Grid is always present in the editor
  const [mode, updateMode] = useState<Mode>(EDIT_MODE);
  const [selectedWidgetIDs, setSelectedWidgetIDs] = useState<string[]>([]);
  const [propertyEditorFocused, setPropertyEditorFocused] = useState(false);
  const [wdgSelectorOpen, setWdgSelectorOpen] = useState(false);
  const [undoStack, setUndoStack] = useState<Widget[][]>([]);
  const [redoStack, setRedoStack] = useState<Widget[][]>([]);
  const PVWS = useRef<PVWSManager | null>(null);
  const selectedWidgets = editorWidgets.filter((w) => selectedWidgetIDs.includes(w.id));

  const updateEditorWidgets = (newWidgets: Widget[] | ((prev: Widget[]) => Widget[])) => {
    setUndoStack((prev) => {
      const updated = [...prev, deepCloneWidgets(editorWidgets)];
      return updated.length > MAX_HISTORY ? updated.slice(1) : updated;
    });

    setRedoStack([]); // Clear redo on new action
    setEditorWidgets((prev) => (typeof newWidgets === "function" ? newWidgets(deepCloneWidgets(prev)) : newWidgets));
  };

  const handleUndo = useCallback(() => {
    setUndoStack((prevUndo) => {
      if (prevUndo.length === 0) return prevUndo;

      const prevState = prevUndo[prevUndo.length - 1];
      setRedoStack((prevRedo) => {
        const updated = [...prevRedo, deepCloneWidgets(editorWidgets)];
        return updated.length > MAX_HISTORY ? updated.slice(1) : updated;
      });
      setEditorWidgets(prevState);
      return prevUndo.slice(0, -1);
    });
  }, [editorWidgets]);

  const handleRedo = useCallback(() => {
    setRedoStack((prevRedo) => {
      if (prevRedo.length === 0) return prevRedo;
      const nextState = prevRedo[prevRedo.length - 1];
      setUndoStack((prevUndo) => {
        const updated = [...prevUndo, deepCloneWidgets(editorWidgets)];
        return updated.length > MAX_HISTORY ? updated.slice(1) : updated;
      });
      setEditorWidgets(nextState);
      return prevRedo.slice(0, -1);
    });
  }, [editorWidgets]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "z") {
        e.preventDefault();
        handleUndo();
      }
      if ((e.ctrlKey && e.key === "y") || (e.ctrlKey && e.shiftKey && e.key === "Z")) {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editorWidgets, handleRedo, handleUndo]);

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
    updateEditorWidgets((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
  };

  const updateWidgetProperties = (id: string, changes: PropertyUpdates) => {
    updateEditorWidgets((prev) =>
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
    updateEditorWidgets((prev) =>
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
        updateEditorWidgets,
        handleRedo,
        handleUndo,
        undoStack,
        redoStack,
        updateWidget,
        getWidget,
        updateWidgetProperties,
        writePVValue,
        PVList,
        selectedWidgetIDs,
        selectedWidgets,
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
