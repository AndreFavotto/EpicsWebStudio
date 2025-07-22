import React, { useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import type { ReactNode } from "react";
import type { PalleteEntry, Widget } from "../../types/widgets";
import { widgetRegistry } from "../Utils/WidgetRegistry";
import { useEditorContext} from "../Utils/EditorContext";
import * as CONSTS from "../../shared/constants";
import Selecto from "react-selecto";
import "./GridZone.css";

const gridMetadata = {
  componentName: "GridZone",
  properties: {
    backgroundColor: { selType: "colorSelector", label: "Background Color", default: CONSTS.DEFAULT_COLORS.inputColor},
    lineColor:       { selType: "colorSelector", label: "Grid Line Color", default: CONSTS.DEFAULT_COLORS.gridLineColor },
    size:            { selType: "number", label: "Grid Size", default: 20 },
  }
};

function renderWidget(widget: Widget): ReactNode {
  const Comp = widgetRegistry[widget.componentName].component;
  return Comp ? <Comp data={widget} /> : <div>Unknown widget</div>;
}

const GridZone: React.FC = () => {
  const { mode, editorWidgets, setEditorWidgets, updateWidget, setSelectedWidgets, selectedWidgets, gridProps, propertyEditorFocused} = useEditorContext();
  const selectoRef = useRef<Selecto>(null);
  const [isDragging, setIsDragging] = useState(false);
 
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mode !== CONSTS.EDIT_MODE) return;
      if (propertyEditorFocused) return;
      if (e.key === "Delete" && selectedWidgets.length > 0) {
        setEditorWidgets(prev => prev.filter(w => !selectedWidgets.map(sw => sw.id).includes(w.id)));
        setSelectedWidgets([]);
      }
    };
  
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mode, propertyEditorFocused, selectedWidgets, setEditorWidgets, setSelectedWidgets]);
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("application/json");
    const entry: PalleteEntry = JSON.parse(data);

    const droppedWidget = widgetRegistry[entry.componentName];
    if (!droppedWidget) {
      console.warn(`Unknown component: ${entry.componentName}`);
      return;
    }

    const widgetProperties = Object.fromEntries(
      Object.entries(droppedWidget.properties).map(([key, def]) => [key, def.default])
    );

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newWidget: Widget = {
      id: `${entry.componentName}-${Date.now()}`,
      componentName: entry.componentName,
      category: droppedWidget.category,
      properties: {
        ...widgetProperties,
        x,
        y,
      },
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
        backgroundColor: gridProps.backgroundColor,
        backgroundImage: `linear-gradient(${gridProps.lineColor} 1px, transparent 1px), linear-gradient(90deg, ${gridProps.lineColor} 1px, transparent 1px)`,
        backgroundSize: `${gridProps.size}px ${gridProps.size}px`,
        position: "relative",
      }}
    >
      {editorWidgets.map((item, index) => (
        <Rnd
          key={index}
          size={{ width: item.properties.width, height: item.properties.height }}
          position={{ x: item.properties.x, y: item.properties.y }}
          bounds="parent"
          id={item.id}
          className="selectable"
          onDrag={() => setIsDragging(true)}
          onDragStop={(e, d) => {
            setIsDragging(false);
            setSelectedWidgets([]);
            updateWidget({
              ...item,
              properties: {
                ...item.properties,
                x: d.x,
                y: d.y,
              },
            });
          }}
          onResizeStart={() => setIsDragging(true)}
          onResizeStop={(e, direction, ref, delta, position) => {
            setIsDragging(false);
            updateWidget({
              ...item,
              properties: {
                ...item.properties,
                width: parseInt(ref.style.width, 10),
                height: parseInt(ref.style.height, 10),
                x: position.x,
                y: position.y,
              },
            });
          }}
        >
        {renderWidget(item)}
      </Rnd>
      ))}
    {isDragging ? null : (
      <Selecto
          ref={selectoRef}
          container={document.getElementById("gridZone")}
          selectableTargets={[".selectable"]}
          hitRate={100}
          selectByClick={true}
          selectFromInside={true}
          preventDragFromInside={true}
          toggleContinueSelect={["ctrl"]}
          onSelectEnd={e => {
            console.log(e)
            if (e.added.length === 0 && e.removed.length === 0) {
              // If nothing was added nor removed, reset selection
              selectoRef.current?.setSelectedTargets([]);
              setSelectedWidgets([]);
            } else{
              const selectedIds = e.selected.map(el => el.id);
              setSelectedWidgets(selectedIds);
            }
          }}
        />)
      }
    </div>
  );
};

export { gridMetadata, GridZone };
