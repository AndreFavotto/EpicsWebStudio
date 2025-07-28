import React, { useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import type { ReactNode } from "react";
import type { Widget, WidgetUpdate } from "../../types/widgets";
import WidgetRegistry from "../Utils/WidgetRegistry";
import { useEditorContext } from "../Utils/EditorContext";
import * as CONSTS from "../../shared/constants";
import Selecto from "react-selecto";
import "./GridZone.css";

function renderWidget(widget: Widget): ReactNode {
  const Comp = WidgetRegistry[widget.widgetName]?.component;
  return Comp ? <Comp data={widget.editableProperties} /> : <div>Unknown widget</div>;
}

const GridZoneComp: React.FC<WidgetUpdate> = ({ data }) => {
  const {
    mode,
    editorWidgets,
    setEditorWidgets,
    updateWidget,
    setSelectedWidgetIDs,
    selectedWidgetIDs,
    propertyEditorFocused,
  } = useEditorContext();

  const selectoRef = useRef<Selecto>(null);
  const snapToGrid = data.snapToGrid?.value;
  const gridLineVisible = data.gridLineVisible?.value;
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mode !== CONSTS.EDIT_MODE || propertyEditorFocused) return;
      if (e.key === "Delete" && selectedWidgetIDs.length > 0) {
        setEditorWidgets((prev) => prev.filter((w) => !selectedWidgetIDs.includes(w.id)));
        setSelectedWidgetIDs([]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mode, propertyEditorFocused, selectedWidgetIDs, setEditorWidgets, setSelectedWidgetIDs]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("application/json");
    if (!data) {
      console.warn("No data found in dropped widget");
      return;
    }
    const entry = JSON.parse(data) as Widget;
    const droppedComp = WidgetRegistry[entry.widgetName];
    if (!droppedComp) {
      console.warn(`Unknown component: ${entry.widgetName}`);
      return;
    }

    // Deep copy
    const editableProperties = Object.fromEntries(
      Object.entries(droppedComp.editableProperties).map(([k, v]) => [k, { ...v }])
    );

    // Drop position
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (editableProperties.x) editableProperties.x.value = x;
    if (editableProperties.y) editableProperties.y.value = y;

    const newWidget: Widget = {
      id: `${entry.widgetName}-${Date.now()}`,
      widgetLabel: droppedComp.widgetLabel,
      component: droppedComp.component,
      widgetName: droppedComp.widgetName,
      category: droppedComp.category,
      editableProperties,
    };
    setEditorWidgets((prev) => [...prev, newWidget]);
  };

  return (
    <div
      id="gridZone"
      className="gridZone"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: data.backgroundColor!.value,
        backgroundImage: gridLineVisible
          ? `linear-gradient(${data.gridLineColor!.value} 1px, transparent 1px), linear-gradient(90deg, ${
              data.gridLineColor!.value
            } 1px, transparent 1px)`
          : "none",
        backgroundSize: gridLineVisible ? `${data.gridSize!.value}px ${data.gridSize!.value}px` : "initial",
      }}
    >
      {editorWidgets.map((item) => (
        <Rnd
          key={item.id}
          size={{
            width: item.editableProperties.width?.value ?? 0,
            height: item.editableProperties.height?.value ?? 0,
          }}
          position={{
            x: item.editableProperties.x?.value ?? 0,
            y: item.editableProperties.y?.value ?? 0,
          }}
          bounds="parent"
          id={item.id}
          className="selectable"
          onDrag={() => setIsDragging(true)}
          onDragStop={(_e, d) => {
            setIsDragging(false);
            setSelectedWidgetIDs([]);

            const gridSize = snapToGrid ? data.gridSize?.value ?? 1 : 1;
            const snappedX = snapToGrid ? Math.round(d.x / gridSize) * gridSize : d.x;
            const snappedY = snapToGrid ? Math.round(d.y / gridSize) * gridSize : d.y;

            updateWidget({
              ...item,
              editableProperties: {
                ...item.editableProperties,
                x: item.editableProperties.x
                  ? { ...item.editableProperties.x, value: snappedX }
                  : item.editableProperties.x,
                y: item.editableProperties.y
                  ? { ...item.editableProperties.y, value: snappedY }
                  : item.editableProperties.y,
              },
            });
          }}
          onResizeStart={() => setIsDragging(true)}
          onResizeStop={(_e, _direction, ref, _delta, position) => {
            setIsDragging(false);

            const gridSize = snapToGrid ? data.gridSize?.value ?? 1 : 1;

            const snappedWidth = snapToGrid
              ? Math.round(parseInt(ref.style.width, 10) / gridSize) * gridSize
              : parseInt(ref.style.width, 10);
            const snappedHeight = snapToGrid
              ? Math.round(parseInt(ref.style.height, 10) / gridSize) * gridSize
              : parseInt(ref.style.height, 10);
            const snappedX = snapToGrid ? Math.round(position.x / gridSize) * gridSize : position.x;
            const snappedY = snapToGrid ? Math.round(position.y / gridSize) * gridSize : position.y;

            updateWidget({
              ...item,
              editableProperties: {
                ...item.editableProperties,
                width: item.editableProperties.width
                  ? { ...item.editableProperties.width, value: snappedWidth }
                  : item.editableProperties.width,
                height: item.editableProperties.height
                  ? { ...item.editableProperties.height, value: snappedHeight }
                  : item.editableProperties.height,
                x: item.editableProperties.x
                  ? { ...item.editableProperties.x, value: snappedX }
                  : item.editableProperties.x,
                y: item.editableProperties.y
                  ? { ...item.editableProperties.y, value: snappedY }
                  : item.editableProperties.y,
              },
            });
          }}
        >
          {renderWidget(item)}
        </Rnd>
      ))}
      {!isDragging && (
        <Selecto
          ref={selectoRef}
          container={document.getElementById("gridZone")}
          selectableTargets={[".selectable"]}
          hitRate={100}
          selectByClick
          selectFromInside
          preventDragFromInside
          toggleContinueSelect={["ctrl"]}
          onSelectEnd={(e) => {
            if (e.added.length === 0 && e.removed.length === 0) {
              selectoRef.current?.setSelectedTargets([]);
              setSelectedWidgetIDs([]);
            } else {
              const selectedIDs = e.selected.map((el) => el.id);
              setSelectedWidgetIDs(selectedIDs);
            }
          }}
        />
      )}
    </div>
  );
};

export { GridZoneComp };
