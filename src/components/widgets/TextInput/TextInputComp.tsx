import React from "react";
import type { Widget, WidgetUpdate } from "../../../types/widgets";
import { useEditorContext } from "../../../Utils/EditorContext";
import { TextField } from "@mui/material";

const TextInputComp: React.FC<WidgetUpdate> = ({ data }) => {
  const { mode } = useEditorContext();
  const { disabled, tooltip, textColor, pvName, label, backgroundColor } = data;

  const handleClick = (e: React.MouseEvent) => {
    // no action on click in runtime mode
  };

  //TODO: write to PV or handle input change in runtime mode

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
          alignItems: "stretch", // ensures input grows
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
      onClick={(e) => handleClick(e)}
    >
      {label?.value}
    </TextField>
  );
};

export { TextInputComp };
