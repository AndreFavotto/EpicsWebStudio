import React from "react";
import "./GridZone.css"; 
import type { ReactNode } from "react";
import { Rnd } from "react-rnd";
import type { PalleteEntry, Widget } from "../../types/widgets";
import { widgetRegistry } from "../../registry/widgetRegistry";

function renderWidget(widget: Widget): ReactNode {
  const Comp = widgetRegistry[widget.componentName].component;
  return Comp ? <Comp widget={widget} /> : <div>Unknown widget</div>;
}

const GridZone: React.FC<{
  dropped: Widget[];
  onDropWidget: (widget: Widget) => void;
}> = ({ dropped, onDropWidget }) => {

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("application/json");
    const entry: PalleteEntry = JSON.parse(data);

    const droppedData = widgetRegistry[entry.componentName].metadata;
    if (!droppedData) {
      console.warn(`Unknown component: ${entry.componentName}`);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newWidget: Widget = {
      id: `${droppedData.componentName}-${Date.now()}`,
      label: droppedData.label,
      x,
      y,
      width: droppedData.defaultWidth,
      height: droppedData.defaultHeight,
      componentName: droppedData.componentName,
    };

    onDropWidget(newWidget);
  };

  return (
    <div className="grid-zone" onDragOver={handleDragOver} onDrop={handleDrop}>
      {dropped.map((item) => (
        <Rnd
          key={item.id}
          default={{
            x: item.x,
            y: item.y,
            width: item.width,
            height: item.height,
          }}
          bounds="parent"
        >
          <div className="widget-container">
            {renderWidget(item)}
          </div>
        </Rnd>
      ))}
    </div>
  );
};

export default GridZone;