import React from "react";
import type { Widget } from "../../../types/widgets";
import { useEditorContext } from "../../Utils/EditorContext";
import { DEFAULT_COLORS } from "../../../shared/constants";
import { TextField } from "@mui/material";

const textInputMetadata = {
  componentName: "TextInputWidget",
  properties: {
    width:           { selType: "number",        label: "Width",            default: 100 },
    height:          { selType: "number",        label: "Height",           default: 40 },
    label:           { selType: "string",        label: "Label",            default: "Input" },
    pv:              { selType: "string",        label: "PV Name",          default: "" },
    backgroundColor: { selType: "colorSelector", label: "Background Color", default: DEFAULT_COLORS.inputColor},
    textColor:       { selType: "colorSelector", label: "Text Color",       default: DEFAULT_COLORS.textColor},
    disabled:        { selType: "boolean",       label: "Disabled" ,        default: false },
    tooltip:         { selType: "string",        label: "Tooltip",          default: "" },
  }
};

type Props = {
  data: Widget;
};

const TextInputWidget: React.FC<Props> = ({ data }) => {
  const { mode, selectWidget } = useEditorContext();
  const {
      label,
      pv,
      backgroundColor,
      textColor,
      disabled,
      tooltip,
    } = data.properties;

    const handleClick = (e: React.MouseEvent) => {
      if (mode === "edit") {
        e.stopPropagation();
        selectWidget(data.id);
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
            alignItems: "stretch", // ensures input grows
          },
          "& input": {
            height: "100%",
            boxSizing: "border-box",
          },
          backgroundColor: backgroundColor,
          color: textColor,
        }}
        variant="outlined"
        disabled={disabled}
        size="small"
        onClick={(e) => handleClick(e)}
      >
      {label}
    </TextField>
  );
};

export { textInputMetadata, TextInputWidget };