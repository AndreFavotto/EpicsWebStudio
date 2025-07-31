import React from "react";
import type { WidgetUpdate } from "../../../types/widgets";
import { mapVAlign, mapHAlign } from "../../../shared/helpers";

const TextUpdateComp: React.FC<WidgetUpdate> = ({ data }) => {
  const p = data.editableProperties;

  if (!p.visible?.value) return null;

  return (
    <div
      title={p.tooltip?.value ?? ""}
      className="textUpdate"
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        zIndex: p.zIndex?.value,
        justifyContent: mapHAlign(p.textHAlign?.value),
        alignItems: mapVAlign(p.textVAlign?.value),
        backgroundColor: p.backgroundColor?.value,
        fontSize: p.fontSize?.value,
        fontFamily: p.fontFamily?.value,
        fontWeight: p.fontBold?.value ? "bold" : "normal",
        fontStyle: p.fontItalic?.value ? "italic" : "normal",
        color: p.textColor?.value,
        borderRadius: p.borderRadius?.value,
        borderStyle: p.borderStyle?.value,
        borderWidth: p.borderWidth?.value,
        borderColor: p.borderColor?.value,
      }}
    >
      {data.pvValue ?? p.pvName?.value ?? p.label?.value}
    </div>
  );
};

export { TextUpdateComp };
