import React from "react";
import type { Widget } from "../../../types/widgets";
import { useEditorContext } from "../../Utils/EditorContext";
import * as CONSTS from "../../../shared/constants";
import { TextField } from "@mui/material";

const textInputMetadata = {
  componentName: "TextInput",
  category: "Monitoring",
  properties: {
    /* common */
    x:               { selType: "number",        label: "X",                default: "" },
    y:               { selType: "number",        label: "Y",                default: "" },
    disabled:        { selType: "boolean",       label: "Disabled" ,        default: false },
    tooltip:         { selType: "string",        label: "Tooltip",          default: "" },
    textColor:       { selType: "colorSelector", label: "Text Color",       default: CONSTS.DEFAULT_COLORS.textColor},
    borderRadius:    { selType: "number",        label: "Border Radius",    default: 4 },
    pv:              { selType: "string",        label: "PV Name",          default: "" },
    /* specific */
    width:           { selType: "number",        label: "Width",            default: 100 },
    height:          { selType: "number",        label: "Height",           default: 40 },
    label:           { selType: "string",        label: "Label",            default: "Input" },
    backgroundColor: { selType: "colorSelector", label: "Background Color", default: CONSTS.DEFAULT_COLORS.inputColor},
  }
};

type Props = {
  data: Widget;
};

const TextInput: React.FC<Props> = ({ data }) => {
  const { mode } = useEditorContext();
  const {
      disabled,
      tooltip,
      textColor,
      pv,
      label,
      backgroundColor,
    } = data.properties;

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
          backgroundColor: backgroundColor,
          color: textColor,
        }}
        variant="outlined"
        label={pv || label}
        disabled={disabled}
        size="small"
        onClick={(e) => handleClick(e)}
      >
      {label}
    </TextField>
  );
};

export { textInputMetadata, TextInput };