import React from "react";
import type { Widget } from "../../../types/widgets";
import * as CONSTS from "../../../shared/constants";

const labelMetadata = {
  componentName: "TextLabel",
  category: "Basic",
    properties: {
      /* common */
      x:               { selType: "number",        label: "X",                default: "" },
      y:               { selType: "number",        label: "Y",                default: "" },
      tooltip:         { selType: "string",        label: "Tooltip",          default: "" },
      textColor:       { selType: "colorSelector", label: "Text Color",       default: CONSTS.DEFAULT_COLORS.textColor},
      borderRadius:    { selType: "number",        label: "Border Radius",    default: 2 },
      fontSize:        { selType: "number",        label: "Font Size",        default: 14 },
      /* specific */
      width:           { selType: "number",        label: "Width",            default: 100 },
      height:          { selType: "number",        label: "Height",           default: 40 },
      label:           { selType: "string",        label: "Label",            default: "Text Label" },
      backgroundColor: { selType: "colorSelector", label: "Background Color", default: CONSTS.DEFAULT_COLORS.labelColor},
    }
};

type Props = {
  data: Widget;
};

const TextLabel: React.FC<Props> = ({ data }) => {
    const {
      label,
      backgroundColor,
      textColor,
      borderRadius,
      fontSize,
      disabled,
      tooltip,
    } = data.properties;
    return (
    <div className="textLabel"
      style={{
        width: "100%",
        height: "100%",
        borderRadius: borderRadius,
        fontSize: fontSize,
        backgroundColor: backgroundColor,
        color: textColor,
        border: "none",
      }}>
      {label}
    </div>
  );
};

export { labelMetadata, TextLabel };