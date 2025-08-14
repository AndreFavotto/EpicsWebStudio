import { useState, useCallback, useRef, useMemo } from "react";
import type {
  Widget,
  WidgetProperties,
  PropertyKey,
  PropertyUpdates,
  MultiWidgetPropertyUpdates,
  GridPosition,
} from "../types/widgets";
import { GridZone } from "../components/GridZone";
import { MAX_HISTORY } from "../constants/constants";

function deepCloneWidgetList(widgets: Widget[]): Widget[] {
  return widgets.map(deepCloneWidget);
}

function deepCloneWidget(widget: Widget): Widget {
  return {
    ...widget,
    editableProperties: Object.fromEntries(Object.entries(widget.editableProperties).map(([k, v]) => [k, { ...v }])),
  };
}

export function useWidgetManager() {
  const [undoStack, setUndoStack] = useState<Widget[][]>([]);
  const [redoStack, setRedoStack] = useState<Widget[][]>([]);
  const [editorWidgets, setEditorWidgets] = useState<Widget[]>([GridZone]);
  const [selectedWidgetIDs, setSelectedWidgetIDs] = useState<string[]>([]);
  const clipboard = useRef<Widget[]>([]);
  const copiedGroupBounds = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const selectedWidgets = editorWidgets.filter((w) => selectedWidgetIDs.includes(w.id));
  const editingWidgets = useMemo(() => {
    return selectedWidgets.length > 0 ? selectedWidgets : [GridZone];
  }, [selectedWidgets]);

  const groupBounds = useMemo(() => {
    if (selectedWidgets.length === 0) return null;

    const left = Math.min(...selectedWidgets.map((w) => w.editableProperties.x!.value));
    const top = Math.min(...selectedWidgets.map((w) => w.editableProperties.y!.value));
    const right = Math.max(
      ...selectedWidgets.map((w) => w.editableProperties.x!.value + w.editableProperties.width!.value)
    );
    const bottom = Math.max(
      ...selectedWidgets.map((w) => w.editableProperties.y!.value + w.editableProperties.height!.value)
    );
    return {
      x: left,
      y: top,
      width: right - left,
      height: bottom - top,
    };
  }, [selectedWidgets]);

  const getZIndexBounds = (widgets: Widget[]) => {
    if (widgets.length === 0) return { min: 0, max: 0 };

    let min = Infinity;
    let max = -Infinity;

    for (const w of widgets) {
      if (!w.editableProperties.zIndex) continue;
      const zIdx = w.editableProperties.zIndex.value;
      if (zIdx < min) min = zIdx;
      if (zIdx > max) max = zIdx;
    }

    return { min, max };
  };

  const { minWdgZIndex, maxWdgZIndex } = useMemo(() => {
    const { min, max } = getZIndexBounds(editorWidgets);
    return { minWdgZIndex: min, maxWdgZIndex: max };
  }, [editorWidgets]);

  const updateEditorWidgetList = useCallback(
    (newWidgets: Widget[] | ((prev: Widget[]) => Widget[]), keepHistory = true) => {
      if (keepHistory) {
        setUndoStack((prev) => {
          const updated = [...prev, deepCloneWidgetList(editorWidgets)];
          return updated.length > MAX_HISTORY ? updated.slice(1) : updated;
        });
        setRedoStack([]);
      }
      setEditorWidgets((prev) =>
        typeof newWidgets === "function" ? newWidgets(deepCloneWidgetList(prev)) : newWidgets
      );
    },
    [editorWidgets]
  );

  const batchWidgetUpdate = (updates: MultiWidgetPropertyUpdates, keepHistory = true) => {
    const idsToUpdate = new Set(Object.keys(updates));
    updateEditorWidgetList(
      (prev) =>
        prev.map((w) => {
          if (!idsToUpdate.has(w.id)) return w;
          const changes = updates[w.id];
          const updatedProps: WidgetProperties = { ...w.editableProperties };
          for (const [k, v] of Object.entries(changes)) {
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
        }),
      keepHistory
    );
  };

  const getWidget = useCallback((id: string) => editorWidgets.find((w) => w.id === id), [editorWidgets]);

  const addWidget = (newWidget: Widget) => {
    updateEditorWidgetList((prev) => [...prev, newWidget]);
  };

  const updateWidgetProperties = (id: string, changes: PropertyUpdates, keepHistory = true) => {
    const updates: MultiWidgetPropertyUpdates = { [id]: changes };
    batchWidgetUpdate(updates, keepHistory);
  };

  const stepForward = (id: string | undefined = undefined) => {
    const updates: MultiWidgetPropertyUpdates = {};
    const toUpdate = id ? [getWidget(id)] : selectedWidgets;
    toUpdate.forEach((w) => {
      if (!w?.editableProperties.zIndex) return;
      const currentZIndex = w.editableProperties.zIndex.value;
      updates[w.id] = { zIndex: currentZIndex + 1 };
    });
    batchWidgetUpdate(updates);
  };

  const stepBackwards = (id: string | undefined = undefined) => {
    const updates: MultiWidgetPropertyUpdates = {};
    const toUpdate = id ? [getWidget(id)] : selectedWidgets;
    toUpdate.forEach((w) => {
      if (!w?.editableProperties.zIndex) return;
      const currentZIndex = w.editableProperties.zIndex.value;
      updates[w.id] = { zIndex: currentZIndex - 1 };
    });
    batchWidgetUpdate(updates);
  };

  const bringToFront = (id: string | undefined = undefined) => {
    const updates: MultiWidgetPropertyUpdates = {};
    const toUpdate = id ? [getWidget(id)] : selectedWidgets;
    toUpdate.forEach((w) => {
      if (!w?.editableProperties.zIndex) return;
      updates[w.id] = { zIndex: maxWdgZIndex + 1 };
    });
    batchWidgetUpdate(updates);
  };

  const sendToBack = (id: string | undefined = undefined) => {
    const updates: MultiWidgetPropertyUpdates = {};
    const toUpdate = id ? [getWidget(id)] : selectedWidgets;
    toUpdate.forEach((w) => {
      if (!w?.editableProperties.zIndex) return;
      updates[w.id] = { zIndex: minWdgZIndex - 1 };
    });
    batchWidgetUpdate(updates);
  };

  const alignLeft = () => {
    if (selectedWidgets.length < 2) return;
    const leftX = Math.min(...selectedWidgets.map((w) => w.editableProperties.x?.value ?? 0));
    const updates: MultiWidgetPropertyUpdates = {};
    selectedWidgets.forEach((w) => {
      updates[w.id] = { x: leftX };
    });
    batchWidgetUpdate(updates);
  };

  const alignRight = () => {
    if (selectedWidgets.length < 2) return;
    const rightX = Math.max(
      ...selectedWidgets.map((w) => (w.editableProperties.x?.value ?? 0) + (w.editableProperties.width?.value ?? 0))
    );
    const updates: MultiWidgetPropertyUpdates = {};
    selectedWidgets.forEach((w) => {
      if (!w.editableProperties.x || !w.editableProperties.width) return;
      updates[w.id] = { x: rightX - w.editableProperties.width.value };
    });
    batchWidgetUpdate(updates);
  };

  const alignTop = () => {
    if (selectedWidgets.length < 2) return;
    const topY = Math.min(...selectedWidgets.map((w) => w.editableProperties.y?.value ?? 0));
    const updates: MultiWidgetPropertyUpdates = {};
    selectedWidgets.forEach((w) => {
      updates[w.id] = { y: topY };
    });
    batchWidgetUpdate(updates);
  };

  const alignBottom = () => {
    if (selectedWidgets.length < 2) return;
    const bottomY = Math.max(
      ...selectedWidgets.map((w) => (w.editableProperties.y?.value ?? 0) + (w.editableProperties.height?.value ?? 0))
    );
    const updates: MultiWidgetPropertyUpdates = {};
    selectedWidgets.forEach((w) => {
      if (!w.editableProperties.y || !w.editableProperties.height) return;
      updates[w.id] = { y: bottomY - w.editableProperties.height.value };
    });
    batchWidgetUpdate(updates);
  };

  const alignHorizontalCenter = () => {
    if (selectedWidgets.length < 2) return;
    const minX = Math.min(...selectedWidgets.map((w) => w.editableProperties.x?.value ?? 0));
    const maxX = Math.max(
      ...selectedWidgets.map((w) => (w.editableProperties.x?.value ?? 0) + (w.editableProperties.width?.value ?? 0))
    );
    const centerX = (minX + maxX) / 2;

    const updates: MultiWidgetPropertyUpdates = {};
    selectedWidgets.forEach((w) => {
      if (!w.editableProperties.x || !w.editableProperties.width) return;
      updates[w.id] = { x: centerX - w.editableProperties.width.value / 2 };
    });
    batchWidgetUpdate(updates);
  };

  const alignVerticalCenter = () => {
    if (selectedWidgets.length < 2) return;
    const minY = Math.min(...selectedWidgets.map((w) => w.editableProperties.y?.value ?? 0));
    const maxY = Math.max(
      ...selectedWidgets.map((w) => (w.editableProperties.y?.value ?? 0) + (w.editableProperties.height?.value ?? 0))
    );
    const centerY = (minY + maxY) / 2;

    const updates: MultiWidgetPropertyUpdates = {};
    selectedWidgets.forEach((w) => {
      if (!w.editableProperties.y || !w.editableProperties.height) return;
      updates[w.id] = { y: centerY - w.editableProperties.height.value / 2 };
    });
    batchWidgetUpdate(updates);
  };

  const distributeHorizontal = () => {
    if (selectedWidgets.length < 3) return; // Need at least 3 to distribute

    const sorted = [...selectedWidgets].sort(
      (a, b) => (a.editableProperties.x?.value ?? 0) - (b.editableProperties.x?.value ?? 0)
    );

    const leftX = sorted[0].editableProperties.x?.value ?? 0;
    const rightX =
      (sorted[sorted.length - 1].editableProperties.x?.value ?? 0) +
      (sorted[sorted.length - 1].editableProperties.width?.value ?? 0);

    const totalWidth = sorted.reduce((sum, w) => sum + (w.editableProperties.width?.value ?? 0), 0);
    const spacing = (rightX - leftX - totalWidth) / (sorted.length - 1);

    let currentX = leftX;
    const updates: MultiWidgetPropertyUpdates = {};

    sorted.forEach((w, idx) => {
      if (idx === 0 || idx === sorted.length - 1) return; // skip first and last
      if (!w.editableProperties.x) return;
      currentX += (sorted[idx - 1].editableProperties.width?.value ?? 0) + spacing;
      updates[w.id] = { x: currentX };
    });

    batchWidgetUpdate(updates);
  };

  const distributeVertical = () => {
    if (selectedWidgets.length < 3) return; // Need at least 3 to distribute

    const sorted = [...selectedWidgets].sort(
      (a, b) => (a.editableProperties.y?.value ?? 0) - (b.editableProperties.y?.value ?? 0)
    );

    const topY = sorted[0].editableProperties.y?.value ?? 0;
    const bottomY =
      (sorted[sorted.length - 1].editableProperties.y?.value ?? 0) +
      (sorted[sorted.length - 1].editableProperties.height?.value ?? 0);

    const totalHeight = sorted.reduce((sum, w) => sum + (w.editableProperties.height?.value ?? 0), 0);
    const spacing = (bottomY - topY - totalHeight) / (sorted.length - 1);

    let currentY = topY;
    const updates: MultiWidgetPropertyUpdates = {};

    sorted.forEach((w, idx) => {
      if (idx === 0 || idx === sorted.length - 1) return; // skip first and last
      if (!w.editableProperties.y) return;
      currentY += (sorted[idx - 1].editableProperties.height?.value ?? 0) + spacing;
      updates[w.id] = { y: currentY };
    });

    batchWidgetUpdate(updates);
  };

  const handleUndo = useCallback(() => {
    setUndoStack((prevUndo) => {
      if (prevUndo.length === 0) return prevUndo;

      const prevState = prevUndo[prevUndo.length - 1];
      setRedoStack((prevRedo) => {
        const updated = [...prevRedo, deepCloneWidgetList(editorWidgets)];
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
        const updated = [...prevUndo, deepCloneWidgetList(editorWidgets)];
        return updated.length > MAX_HISTORY ? updated.slice(1) : updated;
      });
      setEditorWidgets(nextState);
      return prevRedo.slice(0, -1);
    });
  }, [editorWidgets]);

  const copyWidget = useCallback(
    (id: string | undefined = undefined) => {
      const toUpdate = id ? [getWidget(id)] : selectedWidgets;
      if (toUpdate.length === 0) return;
      if (toUpdate.length > 1 && groupBounds) {
        copiedGroupBounds.current = groupBounds;
      }
      clipboard.current = toUpdate
        .filter((w) => w !== undefined)
        .map((w) => {
          return deepCloneWidget(w);
        });
    },
    [selectedWidgets, getWidget, groupBounds]
  );

  const pasteWidget = useCallback(
    (pos: GridPosition) => {
      if (clipboard.current.length === 0) return;

      const pastingGroup = clipboard.current.length > 1;
      const baseX = pastingGroup ? copiedGroupBounds.current.x : clipboard.current[0].editableProperties.x!.value;
      const baseY = pastingGroup ? copiedGroupBounds.current.y : clipboard.current[0].editableProperties.y!.value;

      const dx = pos.x - baseX;
      const dy = pos.y - baseY;

      const newWidgets = clipboard.current.map((w) => {
        const clone = deepCloneWidget(w);
        const id = `${w.widgetName}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        return {
          ...clone,
          id,
          editableProperties: {
            ...w.editableProperties,
            x: w.editableProperties.x
              ? { ...w.editableProperties.x, value: w.editableProperties.x.value + dx }
              : undefined,
            y: w.editableProperties.y
              ? { ...w.editableProperties.y, value: w.editableProperties.y.value + dy }
              : undefined,
          },
        };
      });

      updateEditorWidgetList((prev) => [...prev, ...newWidgets]);
      setSelectedWidgetIDs(newWidgets.map((w) => w.id));
    },
    [updateEditorWidgetList, copiedGroupBounds]
  );

  return {
    editorWidgets,
    setEditorWidgets,
    selectedWidgetIDs,
    editingWidgets,
    groupBounds,
    undoStack,
    redoStack,
    setSelectedWidgetIDs,
    selectedWidgets,
    updateEditorWidgetList,
    batchWidgetUpdate,
    getWidget,
    addWidget,
    copyWidget,
    pasteWidget,
    updateWidgetProperties,
    stepForward,
    stepBackwards,
    bringToFront,
    sendToBack,
    handleRedo,
    handleUndo,
    alignLeft,
    alignRight,
    alignTop,
    alignBottom,
    alignHorizontalCenter,
    alignVerticalCenter,
    distributeHorizontal,
    distributeVertical,
    minWdgZIndex,
    maxWdgZIndex,
  };
}
