import React from "react";
import "./LabelWidget.css"; // Assuming you have some styles for the LabelWidget
import type { Widget } from "../../../types/widgets";

const meta = {
  componentName: "LabelWidget",
  properties: {
    width:          { selType: "number",        label: "Width",            default: 100 },
    height:         { selType: "number",        label: "Height",           default: 40 },
    label:          { selType: "string",        label: "Label",            default: "Label" },
    labelPlacement: { selType: "select",        label: "Label Placement",  default: "end", options: ["start", "top", "bottom", "end"] },
    color:          { selType: "colorSelector", label: "Background Color", default: "primary" },
    textColor:      { selType: "colorSelector", label: "Text Color",       default: "inherit" },
    disabled:       { selType: "boolean",       label: "Disabled" ,        default: false },
    tooltip:        { selType: "string",        label: "Tooltip",          default: "" },
  }
};

type Props = {
  data: Widget;
  // Optional callbacks for builder mode (drag/resize handlers, click, etc)
  onClick?: () => void;
};

const LabelWidget: React.FC<Props> = ({ data }) => {
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
      }}>{data.properties.label}</div></>
  );
};

export { meta as labelMetadata };
export { LabelWidget };