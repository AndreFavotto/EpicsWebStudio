import React, { useState } from "react";
import type { WidgetUpdate } from "../../../types/widgets";
import { useEditorContext } from "../../Utils/useEditorContext";
import { TextField } from "@mui/material";
import { RUNTIME_MODE } from "../../../shared/constants";

const InputFieldComp: React.FC<WidgetUpdate> = ({ data }) => {
  const { mode, writePVValue } = useEditorContext();
  const [inputValue, setInputValue] = useState("");
  const p = data.editableProperties;

  if (!p.visible?.value) return null;

  const handleWrite = (value: number | string) => {
    if (mode !== RUNTIME_MODE) return;
    if (p.pvName?.value) {
      writePVValue(p.pvName.value, value);
    }
  };

  return (
    <TextField
      title={p.tooltip?.value ?? ""}
      sx={{
        width: "100%",
        height: "100%",
        marginTop: "auto",
        marginBottom: "auto",
        marginLeft: "auto",
        marginRight: "auto",
        "& .MuiInputBase-root": {
          height: "100%",
          alignItems: "stretch",
        },
        "& input": {
          height: "100%",
          boxSizing: "border-box",
        },
        zIndex: p.zIndex?.value,
        backgroundColor: p.backgroundColor?.value,
        fontSize: p.fontSize?.value,
        fontFamily: p.fontFamily?.value,
        fontWeight: p.fontWeight?.value,
        color: p.textColor?.value,
        borderRadius: p.borderRadius?.value,
        borderStyle: p.borderStyle?.value,
        borderWidth: p.borderWidth?.value,
        borderColor: p.borderColor?.value,
      }}
      variant="outlined"
      label={p.pvName?.value ?? p.label?.value}
      disabled={p.disabled?.value}
      size="small"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleWrite(inputValue);
        }
      }}
    />
  );
};

export { InputFieldComp };
