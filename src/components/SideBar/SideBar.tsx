import React from "react";
import "./SideBar.css"
import type { PalleteEntry } from "../../types/widgets";
import { widgetRegistry } from "../../registry/widgetRegistry";

const palette: PalleteEntry[] = Object.entries(widgetRegistry).map(
  ([componentName, entry]) => ({
    widgetLabel: entry.metadata.label,
    componentName,
  })
);

const DraggableItem: React.FC<{ entry: PalleteEntry }> = ({ entry }) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("application/json", JSON.stringify(entry));
  };
  return (
    <div className="draggable" draggable onDragStart={handleDragStart}>
      {entry.widgetLabel}
    </div>
  );
};

const SideBar: React.FC = () => {
  return(
    <div className="side-bar">
      <h3>Widgets</h3>
      {palette.map((e, index) => (
        <DraggableItem key={index} entry={e} />
      ))}
    </div>
  )
}

export default SideBar;