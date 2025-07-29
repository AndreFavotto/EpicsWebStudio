import React, { useState } from "react";
import type { WidgetUpdate } from "../../../types/widgets";
import { useEditorContext } from "../../Utils/EditorContext";
import { TextField } from "@mui/material";
import { RUNTIME_MODE } from "../../../shared/constants";

const InputFieldComp: React.FC<WidgetUpdate> = ({ data }) => {
  const { mode, writePVValue } = useEditorContext();
  const { disabled, tooltip, textColor, pvName, label, backgroundColor } = data.editableProperties;

  const [inputValue, setInputValue] = useState("");

  const handleWrite = (value: number | string) => {
    if (mode !== RUNTIME_MODE) return;
    if (pvName?.value) {
      writePVValue(pvName.value, value);
    }
  };

  return (
    <TextField
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
        backgroundColor: backgroundColor?.value,
        color: textColor?.value,
      }}
      variant="outlined"
      label={pvName?.value ?? label?.value}
      disabled={disabled?.value}
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
