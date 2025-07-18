import React from "react";
import type { Widget } from "./types/widgets";
import "./Renderer.css";

type Props = {
  layout: Widget[];
};

const Renderer: React.FC<Props> = ({ layout }) => {
  return (
    <div className="runtime-container">
      {layout.map((item) => (
        <div
          key={item.id}
          style={{
            position: "absolute",
            left: item.x,
            top: item.y,
            width: item.width,
            height: item.height,
          }}
        >
          rendered content for {item.label} ({item.componentName})
        </div>
      ))}
    </div>
  );
};


export default Renderer;
