import React from "react";
import "./GridZone.css";
import { Rnd } from "react-rnd";
import type { ReactNode } from "react";
import type { PalleteEntry, Widget } from "../../types/widgets";
import { widgetRegistry } from "../Utils/WidgetRegistry";
import { useEditorContext} from "../Utils/EditorContext";
import { DEFAULT_COLORS } from "../../shared/constants";

const gridMetadata = {
  componentName: "GridZone", // Not used in the registry, but kept for consistency
  properties: {
    backgroundColor: { selType: "colorSelector", label: "Background Color", default: DEFAULT_COLORS.inputColor},
    lineColor:       { selType: "colorSelector", label: "Grid Line Color", default: DEFAULT_COLORS.gridLineColor },
    size:            { selType: "number", label: "Grid Size", default: 20 },
  }
};

function renderWidget(widget: Widget): ReactNode {
  const Comp = widgetRegistry[widget.componentName].component;
  return Comp ? <Comp data={widget} /> : <div>Unknown widget</div>;
}

const GridZone: React.FC = () => {
  const { mode, widgets, setWidgets, updateWidget, selectWidget, gridProps} = useEditorContext();
  // on mount, set the selected widget to the grid zone
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleClick = () => {
    if (mode === "edit") {
      selectWidget(null);
    }
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
      properties: {
        ...widgetProperties,
        x,
        y,
        width: widgetProperties.width ?? 100,
        height: widgetProperties.height ?? 40,
      },
    };

    setWidgets((prev) => [...prev, newWidget]);
  };

  return (
    <div className="grid-zone" 
      onDragOver={handleDragOver} 
      onDrop={handleDrop} 
      onClick={handleClick}
      style={{
        backgroundColor: gridProps.backgroundColor,
        border: `1px solid ${gridProps.lineColor}`,
        backgroundImage: `linear-gradient(${gridProps.lineColor} 1px, transparent 1px), linear-gradient(90deg, ${gridProps.lineColor} 1px, transparent 1px)`,
        backgroundSize: `${gridProps.size}px ${gridProps.size}px`,
      }}
    >
      {widgets.map((item) => (
        <Rnd
          key={item.id}
          size={{ width: item.properties.width, height: item.properties.height }}
          position={{ x: item.properties.x, y: item.properties.y }}
          bounds="parent"
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
        <div className="widget-container">
          {renderWidget(item)}
        </div>
      </Rnd>
      ))}
    </div>
  );
};

export { gridMetadata, GridZone };
