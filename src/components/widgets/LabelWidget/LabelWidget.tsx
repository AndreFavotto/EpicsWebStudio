import React from "react";
import "./LabelWidget.css"; // Assuming you have some styles for the LabelWidget
import type { Widget } from "../../../types/widgets";

const meta = {
  label: "Label",
  componentName: "LabelWidget",
  defaultWidth: 100,
  defaultHeight: 40,
};

type Props = {
  widget: Widget;
  // Optional callbacks for builder mode (drag/resize handlers, click, etc)
  onClick?: () => void;
};

const LabelWidget: React.FC<Props> = ({ widget }) => {
    return (
    <><div
        style={{
        width: "100%",      // fill parent controlled by Rnd
        height: "100%",     // fill parent controlled by Rnd
        userSelect: "none",
        borderRadius: 4,
        fontSize: 14,
        backgroundColor: "#b4b5b6ff",
        color: "black",
        border: "none",
      }}>{widget.label}</div></>
  );
};

export { meta as labelMetadata };
export { LabelWidget };