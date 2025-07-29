// Ellipse.tsx
import React from "react";
import type { WidgetUpdate } from "../../../types/widgets";

const EllipseComp: React.FC<WidgetUpdate> = ({ data }) => {
  const { backgroundColor, tooltip } = data.editableProperties;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: backgroundColor?.value,
        borderRadius: "50%",
      }}
    />
  );
};

export { EllipseComp };
