import React from "react";
import type { WidgetUpdate } from "../../../types/widgets";

const TextUpdateComp: React.FC<WidgetUpdate> = ({ data }) => {
  const { disabled, tooltip, textColor, pvName, label, backgroundColor, borderRadius, fontSize } =
    data.editableProperties;

  return (
    <div
      className="textUpdate"
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
      {data.pvValue ?? pvName?.value ?? label?.value}
    </div>
  );
};

export { TextUpdateComp };
