import React from "react";
import type { Widget } from "../../../types/widgets";
import { useEditorContext } from "../../Utils/EditorContext";
import * as CONSTS from "../../../shared/constants";

/* prettier-ignore */
const textUpdateMetadata = {
  componentName: "TextUpdate",
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
      label:           { selType: "string",        label: "Label",            default: "Text Update" },
      backgroundColor: { selType: "colorSelector", label: "Background Color", default: CONSTS.DEFAULT_COLORS.readColor},
    }
};

type Props = {
  data: Widget;
};

const TextUpdate: React.FC<Props> = ({ data }) => {
  const { mode } = useEditorContext();
  const { disabled, tooltip, textColor, pv, label, backgroundColor, borderRadius, fontSize, pvValue } = data.properties;

  return (
    <div
      className="textUpdate"
      style={{
        width: "100%",
        height: "100%",
        borderRadius: borderRadius,
        fontSize: fontSize,
        backgroundColor: backgroundColor,
        color: textColor,
        border: "none",
      }}
    >
      {pvValue || pv || label}
    </div>
  );
};

export { textUpdateMetadata, TextUpdate };
