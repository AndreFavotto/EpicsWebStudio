// Rectangle.tsx
import React from "react";
import type { WidgetUpdate } from "../../../types/widgets";

const RectangleComp: React.FC<WidgetUpdate> = ({ data }) => {
  const { backgroundColor, borderRadius, tooltip } = data.editableProperties;

  return (
    <div
      className="rectangle"
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: backgroundColor?.value,
        borderRadius: borderRadius?.value,
      }}
    />
  );
};

export { RectangleComp };
