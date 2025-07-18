import React from "react";
import type { Widget } from "../../../types/widgets";

type Props = {
  widget: Widget;
  // Optional callbacks for builder mode (drag/resize handlers, click, etc)
  onClick?: () => void;
};

const meta = {
  label: "Button",
  componentName: "ButtonWidget",
  defaultWidth: 100,
  defaultHeight: 40,
};

const ButtonWidget: React.FC<Props> = ({ widget, onClick }) => {
    return (
    <button
      style={{
        height: "100%",     // fill parent controlled by Rnd
        width: "100%",      // fill parent controlled by Rnd
        cursor: onClick ? "pointer" : "default",
        userSelect: "none",
        borderRadius: 4,
        fontSize: 14,
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
      }}
      onClick={onClick}
      type="button"
    >
      {widget.label}
    </button>
  );
};

export { meta as buttonMetadata };
export { ButtonWidget };