import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import { Rnd, type Position, type RndDragEvent, type DraggableData } from "react-rnd";
import type { ReactNode } from "react";
import type { Widget, WidgetUpdate } from "../../types/widgets";
import WidgetRegistry from "../Utils/WidgetRegistry";
import { useEditorContext } from "../Utils/useEditorContext";
import { EDIT_MODE, GRID_ID, MAX_WIDGET_ZINDEX } from "../../shared/constants";
import Selecto from "react-selecto";
import "./GridZone.css";
import ContextMenu from "../ContextMenu/ContextMenu";

function renderWidget(widget: Widget): ReactNode {
  const Comp = WidgetRegistry[widget.widgetName]?.component;
  return Comp ? <Comp data={widget} /> : <div>Unknown widget</div>;
}

const GridZoneComp: React.FC<WidgetUpdate> = ({ data }) => {
  const props = data.editableProperties;
  const {
    mode,
    editorWidgets,
    setEditorWidgets,
    updateWidgetProperties,
    setSelectedWidgetIDs,
    selectedWidgetIDs,
    propertyEditorFocused,
  } = useEditorContext();

  const selectoRef = useRef<Selecto>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const userWindowRef = useRef<HTMLDivElement>(null);
  const snapToGrid = props.snapToGrid?.value;
  const gridLineVisible = props.gridLineVisible?.value;
  const [isDragging, setIsDragging] = useState(false);
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const [contextMenuWdgID, setContextMenuWdgID] = useState("");
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const gridSize = props.gridSize!.value;

  useLayoutEffect(() => {
    const container = document.getElementById("gridContainer");
    const el = userWindowRef.current;

    if (container && el) {
      const containerBounds = container.getBoundingClientRect();
      const userWindowBounds = el.getBoundingClientRect();

      const centerX = containerBounds.width / 2 - userWindowBounds.width / 2;
      const centerY = containerBounds.height / 2 - userWindowBounds.height / 2;

      setPan({ x: centerX, y: centerY });
    }
  }, []);

  const ensureGridPosition = (pos: number) => {
    return snapToGrid ? Math.round(pos / gridSize) * gridSize : pos;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mode !== EDIT_MODE || propertyEditorFocused) return;
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
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;
    const userX = (rawX - pan.x) / zoom;
    const userY = (rawY - pan.y) / zoom;

    if (editableProperties.x) editableProperties.x.value = ensureGridPosition(userX);
    if (editableProperties.y) editableProperties.y.value = ensureGridPosition(userY);

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

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    const clickedWidgetID = target.id === "gridZone" ? GRID_ID : target.parentElement?.id;
    setContextMenuWdgID(clickedWidgetID ?? "");
    setContextMenuPos({ x: e.clientX, y: e.clientY });
    setContextMenuVisible(true);
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const scaleFactor = 1.1;
    const direction = e.deltaY < 0 ? 1 : -1;
    const newZoom = zoom * (direction > 0 ? scaleFactor : 1 / scaleFactor);

    const container = gridRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const contentX = (mouseX - pan.x) / zoom;
    const contentY = (mouseY - pan.y) / zoom;

    const newPanX = mouseX - contentX * newZoom;
    const newPanY = mouseY - contentY * newZoom;

    setZoom(newZoom);
    setPan({ x: newPanX, y: newPanY });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || e.altKey) {
      setIsPanning(true);
      lastPosRef.current = { x: e.clientX, y: e.clientY };
      e.preventDefault();
    }
  };

  const handleMouseUp = () => setIsPanning(false);

  const handleDrag = (_e: RndDragEvent, d: DraggableData) => {
    setIsDragging(true);
    // this is necessary only for multiple widget dragging.
    // note: this is a temporary workaround
    if (selectedWidgetIDs.length > 1) {
      const dx = d.deltaX;
      const dy = d.deltaY;
      setEditorWidgets((prev) =>
        prev.map((w) => {
          if (selectedWidgetIDs.includes(w.id)) {
            return {
              ...w,
              editableProperties: {
                ...w.editableProperties,
                x: {
                  ...w.editableProperties.x,
                  value: w.editableProperties.x!.value + dx,
                },
                y: {
                  ...w.editableProperties.y,
                  value: w.editableProperties.y!.value + dy,
                },
              },
            } as Widget;
          }
          return w;
        })
      );
    }
  };

  const handleDragStop = (_e: RndDragEvent, d: DraggableData, w: Widget) => {
    setIsDragging(false);
    updateWidgetProperties(w.id, {
      x: ensureGridPosition(d.x),
      y: ensureGridPosition(d.y),
    });
    // this is necessary only for multiple widget dragging.
    // note: this is a temporary workaround
    if (selectedWidgetIDs.length > 1) {
      setEditorWidgets((prev) =>
        prev.map((w) => {
          if (selectedWidgetIDs.includes(w.id)) {
            return {
              ...w,
              editableProperties: {
                ...w.editableProperties,
                x: {
                  ...w.editableProperties.x,
                  value: ensureGridPosition(w.editableProperties.x!.value),
                },
                y: {
                  ...w.editableProperties.y,
                  value: ensureGridPosition(w.editableProperties.y!.value),
                },
              },
            } as Widget;
          }
          return w;
        })
      );
    }
  };

  const handleResizeStop = (ref: HTMLElement, position: Position, w: Widget) => {
    setIsDragging(false);
    const newWidth = ensureGridPosition(parseInt(ref.style.width));
    const newHeight = ensureGridPosition(parseInt(ref.style.height));
    const newX = ensureGridPosition(position.x);
    const newY = ensureGridPosition(position.y);
    updateWidgetProperties(w.id, { width: newWidth, height: newHeight, x: newX, y: newY });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isPanning) {
        const dx = e.clientX - lastPosRef.current.x;
        const dy = e.clientY - lastPosRef.current.y;
        lastPosRef.current = { x: e.clientX, y: e.clientY };
        setPan((prev) => ({ x: prev.x + dx / zoom, y: prev.y + dy / zoom }));
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isPanning, zoom]);

  useEffect(() => {
    const handleClick = () => setContextMenuVisible(false);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <div
      ref={gridRef}
      id="gridZone"
      className="gridZone"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onContextMenu={handleContextMenu}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      style={{
        backgroundColor: props.backgroundColor!.value,
        backgroundImage: gridLineVisible
          ? `linear-gradient(${props.gridLineColor!.value} 1px, transparent 1px),
       linear-gradient(90deg, ${props.gridLineColor!.value} 1px, transparent 1px)`
          : "none",
        backgroundSize: `${props.gridSize!.value * zoom}px ${props.gridSize!.value * zoom}px`,
        backgroundPosition: `${pan.x % (props.gridSize!.value * zoom)}px ${pan.y % (props.gridSize!.value * zoom)}px`,
      }}
    >
      <div
        id="userWindow"
        ref={userWindowRef}
        className="userWindow"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          width: `${props.windowWidth!.value}px`,
          height: `${props.windowHeight!.value}px`,
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
            style={{
              zIndex: item.editableProperties.zIndex?.value ?? MAX_WIDGET_ZINDEX,
            }}
            bounds="window"
            scale={zoom}
            id={item.id}
            className={`selectable ${selectedWidgetIDs.includes(item.id) ? "selected" : ""}`}
            disableDragging={mode != EDIT_MODE}
            enableResizing={mode == EDIT_MODE}
            onDrag={handleDrag}
            onDragStop={(_e, d) => handleDragStop(_e, d, item)}
            onResizeStart={() => setIsDragging(true)}
            onResizeStop={(_e, _direction, ref, _delta, position) => handleResizeStop(ref, position, item)}
          >
            {renderWidget(item)}
          </Rnd>
        ))}
      </div>
      {!isDragging && !contextMenuVisible && mode == EDIT_MODE && (
        <Selecto
          ref={selectoRef}
          container={document.getElementById("gridContainer")}
          rootContainer={document.getElementById("gridContainer")}
          selectableTargets={[".selectable"]}
          hitRate={100}
          selectByClick
          selectFromInside
          preventDragFromInside
          // preventClickEventOnDragStart
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
      <ContextMenu
        x={contextMenuPos.x}
        y={contextMenuPos.y}
        visible={contextMenuVisible}
        widgetID={contextMenuWdgID}
        onClose={() => setContextMenuVisible(false)}
      />
    </div>
  );
};

export { GridZoneComp };
