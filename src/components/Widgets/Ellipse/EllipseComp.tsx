// Ellipse.tsx
import React from "react";
import type { WidgetUpdate } from "../../../types/widgets";

const EllipseComp: React.FC<WidgetUpdate> = ({ data }) => {
  const p = data.editableProperties;
  if (!p.visible?.value) return null;
  return (
    <div
      title={p.tooltip?.value ?? ""}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        borderRadius: "50%",
        boxSizing: "border-box",
        backgroundColor: p.backgroundColor?.value,
        borderStyle: p.borderStyle?.value,
        borderWidth: p.borderWidth?.value,
        borderColor: p.borderColor?.value,
      }}
    />
  );
};

export { EllipseComp };
