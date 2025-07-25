import React from "react";
import type { WidgetUpdate } from "../../../types/widgets";

const TextLabelComp: React.FC<WidgetUpdate> = ({ data }) => {
  const { label, backgroundColor, textColor, borderRadius, fontSize, tooltip } = data;
  return (
    <div
      className="textLabel"
      style={{
        width: "100%",
        height: "100%",
        borderRadius: borderRadius?.value,
        fontSize: fontSize?.value,
        backgroundColor: backgroundColor?.value,
        color: textColor?.value,
        border: "none",
      }}
    >
      {label?.value}
    </div>
  );
};

export { TextLabelComp };
