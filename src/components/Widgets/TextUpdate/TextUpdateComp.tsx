import React from "react";
import type { WidgetUpdate } from "../../../types/widgets";
import { FLEX_ALIGN_MAP } from "../../../constants/constants";

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
        justifyContent: FLEX_ALIGN_MAP[p.textHAlign?.value ?? "left"],
        alignItems: FLEX_ALIGN_MAP[p.textVAlign?.value ?? "middle"],
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
      {p.pvValue?.value ?? p.pvName?.value ?? p.label?.value}
    </div>
  );
};

export { TextUpdateComp };
