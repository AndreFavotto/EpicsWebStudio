import React, { useEffect, useRef, useState } from "react";
import type { Widget, WidgetUpdate } from "../../types/widgets";
import WidgetRegistry from "../WidgetRegistry/WidgetRegistry";
import { useEditorContext } from "../../context/useEditorContext.tsx";
import { EDIT_MODE, GRID_ID, MIN_WIDGET_ZINDEX, RUNTIME_MODE } from "../../shared/constants";
import Selecto from "react-selecto";
import ContextMenu from "../ContextMenu/ContextMenu";
import "./GridZone.css";
import WidgetRenderer from "../WidgetRenderer/WidgetRenderer.tsx";

const GridZoneComp: React.FC<WidgetUpdate> = ({ data }) => {
  const props = data.editableProperties;
  const { mode, updateEditorWidgets, setSelectedWidgetIDs } = useEditorContext();
  const gridRef = useRef<HTMLDivElement>(null);
  const userWindowRef = useRef<HTMLDivElement>(null);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const selectoRef = useRef<Selecto>(null);
  const isMiddleButtonDownRef = useRef(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const [contextMenuWdgID, setContextMenuWdgID] = useState("");
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [shouldCenterPan, setShouldCenterPan] = useState(true); //start centralizing screen

  const gridSize = props.gridSize!.value;
  const snapToGrid = props.snapToGrid?.value;
  const gridLineVisible = props.gridLineVisible?.value;

  const ensureGridPosition = (pos: number) => {
    return snapToGrid ? Math.round(pos / gridSize) * gridSize : pos;
  };

  const centerScreen = () => {
    setZoom(1);
    setShouldCenterPan(true);
  };

  useEffect(() => {
    if (shouldCenterPan && zoom === 1) {
      const container = document.getElementById("gridContainer");
      const el = userWindowRef.current;

      if (container && el) {
        const containerBounds = container.getBoundingClientRect();
        const userWindowBounds = el.getBoundingClientRect();

        const centerX = containerBounds.width / 2 - userWindowBounds.width / 2;
        const centerY = containerBounds.height / 2 - userWindowBounds.height / 2;

        setPan({ x: centerX, y: centerY });
        setShouldCenterPan(false);
      }
    }
    if (mode == RUNTIME_MODE && zoom != 1) {
      centerScreen();
    }
  }, [shouldCenterPan, zoom, mode]);

  useEffect(() => {
    const handleClick = () => setContextMenuVisible(false);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

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
    updateEditorWidgets((prev) => [...prev, newWidget]);
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (mode != EDIT_MODE) return;
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
    if (mode != EDIT_MODE) return;
    if (e.button === 1 || e.altKey) {
      isMiddleButtonDownRef.current = true;
      lastPosRef.current = { x: e.clientX, y: e.clientY };
      e.preventDefault();
    }
  };

  const handleAuxClick = (_e: React.MouseEvent) => {
    if (mode != EDIT_MODE) return;
    if (!isPanning) centerScreen();
    setIsPanning(false);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    const clickedWidgetID = target.id === "gridZone" ? GRID_ID : target.parentElement?.id;
    setContextMenuWdgID(clickedWidgetID ?? "");
    setContextMenuPos({ x: e.clientX, y: e.clientY });
    setContextMenuVisible(true);
  };

  useEffect(() => {
    if (mode != EDIT_MODE) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (isMiddleButtonDownRef.current) {
        const dx = e.clientX - lastPosRef.current.x;
        const dy = e.clientY - lastPosRef.current.y;
        // Only consider a pan if there is actual movement
        if (!isPanning && (Math.abs(dx) > 2 || Math.abs(dy) > 2)) {
          setIsPanning(true);
        }
        lastPosRef.current = { x: e.clientX, y: e.clientY };
        setPan((prev) => ({ x: prev.x + dx / zoom, y: prev.y + dy / zoom }));
      }
    };

    const handleMouseUp = () => {
      isMiddleButtonDownRef.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isMiddleButtonDownRef, isPanning, setIsPanning, zoom, mode]);

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
      onClick={() => setContextMenuVisible(false)}
      onAuxClick={handleAuxClick}
      style={{
        cursor: isPanning ? "grabbing" : "default",
        zIndex: MIN_WIDGET_ZINDEX - 1,
        backgroundColor: mode == EDIT_MODE ? props.backgroundColor!.value : "white",
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
          backgroundColor: mode == EDIT_MODE ? "transparent" : props.backgroundColor!.value,
          zIndex: MIN_WIDGET_ZINDEX - 1,
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          width: `${props.windowWidth!.value}px`,
          height: `${props.windowHeight!.value}px`,
          overflow: mode !== EDIT_MODE ? "hidden" : "visible",
        }}
      >
        <WidgetRenderer scale={zoom} gridPositioner={ensureGridPosition} setIsDragging={setIsDragging} />
      </div>
      {!contextMenuVisible && !isDragging && mode == EDIT_MODE && (
        <Selecto
          ref={selectoRef}
          container={document.getElementById("gridContainer")}
          rootContainer={document.getElementById("gridContainer")}
          selectableTargets={[".selectable"]}
          hitRate={100}
          selectByClick
          preventDragFromInside
          preventClickEventOnDragStart
          preventClickEventOnDrag
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
