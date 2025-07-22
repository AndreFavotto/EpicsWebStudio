import React, { useEffect } from "react";
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
  const { mode, widgets, setWidgets, updateWidget, selectWidget, selectedWidget, gridProps, propertyEditorFocused} = useEditorContext();
 
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mode !== CONSTS.EDIT_MODE) return;
      if (propertyEditorFocused) return;
      if (e.key === "Delete" && selectedWidget?.id) {
        setWidgets(prev => prev.filter(w => w.id !== selectedWidget.id));
        selectWidget(null);
      }
    };
  
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mode, propertyEditorFocused, selectedWidget?.id]);
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

    setWidgets((prev) => [...prev, newWidget]);
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
      {widgets.map((item, index) => (
        <Rnd
          key={index}
          size={{ width: item.properties.width, height: item.properties.height }}
          position={{ x: item.properties.x, y: item.properties.y }}
          bounds="parent"
          id={item.id}
          className="selectable"
          onDragStop={(e, d) => {
            updateWidget({
              ...item,
              properties: {
                ...item.properties,
                x: d.x,
                y: d.y,
              },
            });
          }}
          onResizeStop={(e, direction, ref, delta, position) => {
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

   <Selecto
      container={document.getElementById("gridZone")}
      selectableTargets={[".selectable"]}
      hitRate={100}
      selectByClick={true}
      selectFromInside={false}
      toggleContinueSelect={["shift"]}
      onSelectEnd={e => {
        e.added.forEach(el => {
          el.classList.add("selected");
          selectWidget(el.id); // for now only the last selected will be the active one
        });
        e.removed.forEach(el => {
          el.classList.remove("selected");
        });
    }}
  />
    </div>
  );
};

export { gridMetadata, GridZone };
