import React from "react";
import { Button } from "@mui/material";
import { useEditorContext } from "../../Utils/EditorContext";
import type { Widget } from "../../../types/widgets";
import * as CONSTS from "../../../shared/constants";
/* prettier-ignore */
const actionButtonMetadata = {
  componentName: "ActionButton",
  category: "Controls",
  properties: {
    /* common */
    x:               { selType: "number",        label: "X",                default: "" },
    y:               { selType: "number",        label: "Y",                default: "" },
    disabled:        { selType: "boolean",       label: "Disabled" ,        default: false },
    tooltip:         { selType: "string",        label: "Tooltip",          default: "" },
    textColor:       { selType: "colorSelector", label: "Text Color",       default: CONSTS.DEFAULT_COLORS.textColor},
    borderRadius:    { selType: "number",        label: "Border Radius",    default: 1 },
    pv:              { selType: "string",        label: "PV Name",          default: "" },
    /* specific */
    width:           { selType: "number",        label: "Width",            default: 100 },
    height:          { selType: "number",        label: "Height",           default: 40 },
    label:           { selType: "string",        label: "Label",            default: "Action Button" },
    backgroundColor: { selType: "colorSelector", label: "Background Color", default: CONSTS.DEFAULT_COLORS.buttonColor},
    actionValue:     { selType: "any",           label: "Action Value",     default: "" },
  }
};

type Props = {
  data: Widget;
};

const ActionButton: React.FC<Props> = ({ data }) => {
  const { mode } = useEditorContext();
  const { disabled, tooltip, textColor, borderRadius, pv, label, backgroundColor, actionValue } = data.properties;

  const handleClick = (e: React.MouseEvent, actionValue: any) => {
    if (mode === CONSTS.RUNTIME_MODE) {
      // Handle action in runtime mode, e.g., send actionValue to a PV or perform an action
      console.log("Button clicked with action value:", actionValue);
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
        borderRadius: borderRadius,
      }}
      disabled={disabled}
      variant="contained"
      onClick={(e) => handleClick(e, actionValue)}
    >
      {label}
    </Button>
  );
};

export { actionButtonMetadata, ActionButton };
