import React, { useMemo, useEffect, type ReactNode } from "react";
import WidgetRegistry from "../WidgetRegistry/WidgetRegistry";
import { useEditorContext } from "../../context/useEditorContext";
import type { MultiWidgetPropertyUpdates, Widget } from "../../types/widgets";
import { Rnd, type Position, type RndDragEvent, type DraggableData } from "react-rnd";
import { EDIT_MODE, MAX_WIDGET_ZINDEX } from "../../constants/constants";
import "./WidgetRenderer.css";

interface RendererProps {
  scale: number;
  ensureGridCoordinate: (coord: number) => number;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
}
const WidgetRenderer: React.FC<RendererProps> = ({ scale, ensureGridCoordinate, setIsDragging }) => {
  const {
    mode,
    editorWidgets,
    updateEditorWidgetList,
    updateWidgetProperties,
    setSelectedWidgetIDs,
    batchWidgetUpdate,
    selectedWidgetIDs,
    selectedWidgets,
    propertyEditorFocused,
  } = useEditorContext();
  const isMultipleSelect = selectedWidgetIDs.length > 1;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mode !== EDIT_MODE || propertyEditorFocused) return;
      if (e.key === "Delete" && selectedWidgetIDs.length > 0) {
        updateEditorWidgetList((prev) => prev.filter((w) => !selectedWidgetIDs.includes(w.id)));
        setSelectedWidgetIDs([]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mode, propertyEditorFocused, selectedWidgetIDs, updateEditorWidgetList, setSelectedWidgetIDs]);

  function renderWidget(widget: Widget): ReactNode {
    const Comp = WidgetRegistry[widget.widgetName]?.component;
    return Comp ? <Comp data={widget} /> : <div>Unknown widget</div>;
  }

  const handleDragStop = (_e: RndDragEvent, d: DraggableData, w: Widget) => {
    setIsDragging(false);
    updateWidgetProperties(w.id, {
      x: ensureGridCoordinate(d.x),
      y: ensureGridCoordinate(d.y),
    });
  };

  const handleResizeStop = (ref: HTMLElement, position: Position, w: Widget) => {
    setIsDragging(false);
    const newWidth = ensureGridCoordinate(parseInt(ref.style.width));
    const newHeight = ensureGridCoordinate(parseInt(ref.style.height));
    const newX = ensureGridCoordinate(position.x);
    const newY = ensureGridCoordinate(position.y);
    updateWidgetProperties(w.id, { width: newWidth, height: newHeight, x: newX, y: newY });
  };

  const handleGroupDragStop = (dx: number, dy: number) => {
    setIsDragging(false);

    const updates: MultiWidgetPropertyUpdates = {};
    selectedWidgets.forEach((widget) => {
      const xProp = widget.editableProperties.x;
      const yProp = widget.editableProperties.y;
      if (!xProp || !yProp) return;

      const newX = ensureGridCoordinate(xProp.value + dx);
      const newY = ensureGridCoordinate(yProp.value + dy);

      updates[widget.id] = { x: newX, y: newY };
    });

    batchWidgetUpdate(updates);
  };

  const handleGroupResizeStop = (ref: HTMLElement) => {
    setIsDragging(false);
    if (!groupBox) return;
    const newGroupWidth = ref.offsetWidth;
    const newGroupHeight = ref.offsetHeight;

    const scaleX = newGroupWidth / groupBox.width;
    const scaleY = newGroupHeight / groupBox.height;

    const updates: MultiWidgetPropertyUpdates = {};

    selectedWidgets.forEach((w) => {
      const widthProp = w.editableProperties.width;
      const heightProp = w.editableProperties.height;
      const xProp = w.editableProperties.x;
      const yProp = w.editableProperties.y;

      if (!widthProp || !heightProp || !xProp || !yProp) return;

      const newWidth = ensureGridCoordinate(widthProp.value * scaleX);
      const newHeight = ensureGridCoordinate(heightProp.value * scaleY);

      const relativeX = xProp.value - groupBox.x;
      const relativeY = yProp.value - groupBox.y;

      const newX = ensureGridCoordinate(groupBox.x + relativeX * scaleX);
      const newY = ensureGridCoordinate(groupBox.y + relativeY * scaleY);

      updates[w.id] = { width: newWidth, height: newHeight, x: newX, y: newY };
    });

    batchWidgetUpdate(updates);
  };

  const groupBox = useMemo(() => {
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

  return (
    <>
      {isMultipleSelect && groupBox && (
        <Rnd
          id="groupBox"
          bounds="window"
          scale={scale}
          disableDragging={mode != EDIT_MODE}
          size={{ width: groupBox.width, height: groupBox.height }}
          position={{ x: groupBox.x, y: groupBox.y }}
          onDrag={() => setIsDragging(true)}
          onDragStop={(_e, d) => {
            const dx = d.x - groupBox.x;
            const dy = d.y - groupBox.y;
            handleGroupDragStop(dx, dy);
          }}
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
          onResize={() => setIsDragging(true)}
          onResizeStop={(_e, _direction, ref) => handleGroupResizeStop(ref)}
          style={{ outline: `${selectedWidgetIDs.length > 1 ? "1px dashed" : "none"}`, zIndex: MAX_WIDGET_ZINDEX + 1 }}
        >
          {selectedWidgets.map((w) => {
            return (
              <div
                key={w.id}
                className="selected"
                style={{
                  width: w.editableProperties.width!.value,
                  height: w.editableProperties.height!.value,
                  left: w.editableProperties.x!.value - groupBox.x,
                  top: w.editableProperties.y!.value - groupBox.y,
                }}
              >
                {renderWidget(w)}
              </div>
            );
          })}
        </Rnd>
      )}
      {editorWidgets.map((w) => {
        const isInGroupBox = selectedWidgetIDs.includes(w.id) && isMultipleSelect;
        const isOnlySelected = selectedWidgetIDs.includes(w.id) && !isMultipleSelect;
        return (
          <Rnd
            key={w.id}
            size={{
              width: w.editableProperties.width?.value ?? 0,
              height: w.editableProperties.height?.value ?? 0,
            }}
            position={{
              x: w.editableProperties.x?.value ?? 0,
              y: w.editableProperties.y?.value ?? 0,
            }}
            style={{
              zIndex: w.editableProperties.zIndex?.value ?? MAX_WIDGET_ZINDEX,
            }}
            bounds="window"
            scale={scale}
            id={w.id}
            className={`selectable ${isOnlySelected ? "selected" : ""}`}
            disableDragging={mode != EDIT_MODE}
            enableResizing={mode == EDIT_MODE}
            onDrag={() => setIsDragging(true)}
            onDragStop={(_e, d) => handleDragStop(_e, d, w)}
            onResizeStart={() => setIsDragging(true)}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            onResizeStop={(_e, _direction, ref, _delta, position) => handleResizeStop(ref, position, w)}
          >
            {isInGroupBox ? null : renderWidget(w)}
          </Rnd>
        );
      })}
    </>
  );
};
export default WidgetRenderer;
