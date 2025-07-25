import React from "react";
import type { WidgetUpdate } from "../../../types/widgets";
import { useEditorContext } from "../../Utils/EditorContext";

const TextUpdateComp: React.FC<WidgetUpdate> = ({ data }) => {
  const { mode } = useEditorContext();
  const { disabled, tooltip, textColor, pvName, label, backgroundColor, borderRadius, fontSize, pvValue } = data;

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
      {pvValue?.value ?? pvName?.value ?? label?.value}
    </div>
  );
};

export { TextUpdateComp };
