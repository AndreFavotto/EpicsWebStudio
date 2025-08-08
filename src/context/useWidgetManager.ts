import { useState, useCallback, useEffect } from "react";
import type { Widget, WidgetProperties, PropertyKey, PropertyUpdates } from "../types/widgets";
import { GridZone } from "../components/GridZone";
import { MAX_HISTORY, MAX_WIDGET_ZINDEX, MIN_WIDGET_ZINDEX } from "../shared/constants";

function deepCloneWidgets(widgets: Widget[]): Widget[] {
  return widgets.map((widget) => ({
    ...widget,
    editableProperties: Object.fromEntries(Object.entries(widget.editableProperties).map(([k, v]) => [k, { ...v }])),
  }));
}

export function useWidgetManager() {
  const [undoStack, setUndoStack] = useState<Widget[][]>([]);
  const [redoStack, setRedoStack] = useState<Widget[][]>([]);
  const [editorWidgets, setEditorWidgets] = useState<Widget[]>([GridZone]);
  const [selectedWidgetIDs, setSelectedWidgetIDs] = useState<string[]>([]);
  const selectedWidgets = editorWidgets.filter((w) => selectedWidgetIDs.includes(w.id));

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

  const updateEditorWidgets = (newWidgets: Widget[] | ((prev: Widget[]) => Widget[])) => {
    setUndoStack((prev) => {
      const updated = [...prev, deepCloneWidgets(editorWidgets)];
      return updated.length > MAX_HISTORY ? updated.slice(1) : updated;
    });

    setRedoStack([]); // Clear redo on new action
    setEditorWidgets((prev) => (typeof newWidgets === "function" ? newWidgets(deepCloneWidgets(prev)) : newWidgets));
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

  const increaseZIndex = (id: string) => {
    const w = getWidget(id);
    if (!w?.editableProperties.zIndex) return;
    const currentZIndex = w.editableProperties.zIndex.value;
    if (currentZIndex < MAX_WIDGET_ZINDEX) updateWidgetProperties(id, { zIndex: currentZIndex + 1 });
  };

  const decreaseZIndex = (id: string) => {
    const w = getWidget(id);
    if (!w?.editableProperties.zIndex) return;
    const currentZIndex = w.editableProperties.zIndex.value;
    if (currentZIndex > MIN_WIDGET_ZINDEX) updateWidgetProperties(id, { zIndex: currentZIndex - 1 });
  };

  const setMaxZIndex = (id: string) => {
    updateWidgetProperties(id, { zIndex: MAX_WIDGET_ZINDEX });
  };

  const setMinZIndex = (id: string) => {
    updateWidgetProperties(id, { zIndex: MIN_WIDGET_ZINDEX });
  };

  return {
    editorWidgets,
    setEditorWidgets,
    selectedWidgetIDs,
    undoStack,
    redoStack,
    setSelectedWidgetIDs,
    selectedWidgets,
    updateEditorWidgets,
    getWidget,
    updateWidget,
    updateWidgetProperties,
    increaseZIndex,
    decreaseZIndex,
    setMaxZIndex,
    setMinZIndex,
    handleRedo,
    handleUndo,
  };
}
