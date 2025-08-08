import React from "react";
import { Button } from "@mui/material";
import { useEditorContext } from "../../../context/useEditorContext";
import type { WidgetUpdate } from "../../../types/widgets";
import { RUNTIME_MODE } from "../../../shared/constants";
import { mapVAlign, mapHAlign } from "../../../shared/helpers";

const ActionButtonComp: React.FC<WidgetUpdate> = ({ data }) => {
  const { mode, writePVValue } = useEditorContext();
  const p = data.editableProperties;

  const handleClick = (_e: React.MouseEvent) => {
    if (mode === RUNTIME_MODE) {
      if (p.pvName?.value && p.actionValue?.value) {
        writePVValue(p.pvName.value, p.actionValue.value);
      }
    }
  };

  if (!p.visible?.value) return null;

  return (
    <Button
      title={p.tooltip?.value ?? ""}
      sx={{
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
      disabled={p.disabled!.value}
      variant="contained"
      onClick={(e) => handleClick(e)}
    >
      {p.label!.value}
    </Button>
  );
};

export { ActionButtonComp };
