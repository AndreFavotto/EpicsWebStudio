import React from "react";
import { Button } from "@mui/material";
import { useEditorContext } from "../../Utils/EditorContext";
import type { Widget } from "../../../types/widgets";
import { DEFAULT_COLORS } from "../../../shared/constants";

const buttonMetadata = {
  componentName: "ButtonWidget",
  properties: {
    width:           { selType: "number",        label: "Width",            default: 100 },
    height:          { selType: "number",        label: "Height",           default: 40 },
    label:           { selType: "string",        label: "Label",            default: "Button" },
    pv:              { selType: "string",        label: "PV Name",          default: "" },
    labelFromPV:     { selType: "boolean",       label: "Use PV Label",     default: false },
    backgroundColor: { selType: "colorSelector", label: "Background Color", default: DEFAULT_COLORS.buttonColor},
    textColor:       { selType: "colorSelector", label: "Text Color",       default: DEFAULT_COLORS.textColor},
    actionValue:     { selType: "any",           label: "Action Value",     default: "" },
    disabled:        { selType: "boolean",       label: "Disabled" ,        default: false },
    tooltip:         { selType: "string",        label: "Tooltip",          default: "" },
  }
};

type Props = {
  data: Widget;
};

const ButtonWidget: React.FC<Props> = ({data}) => {
    const { mode, selectWidget } = useEditorContext();
    const {
      label,
      pv,
      labelFromPV,
      backgroundColor,
      textColor,
      actionValue,
      disabled,
      tooltip,
    } = data.properties;

    const handleClick = (e: React.MouseEvent, actionValue: any) => {
      if (mode === "edit") {
        e.stopPropagation();
        selectWidget(data.id);
      } else {
        // In runtime mode, write to the PV or perform the action
      }
    };

    return (
      <Button
        sx={{
          width: "100%",
          height: "100%",
          marginTop: "auto",
          marginBottom: "auto",
          marginLeft: "auto",
          marginRight: "auto",
          backgroundColor: backgroundColor,
          color: textColor,
        }}
        disabled={disabled}
        variant="contained"
        onClick={(e) => handleClick(e, actionValue)}
      >
      {label}
      </Button>
  );
};

export { buttonMetadata, ButtonWidget };