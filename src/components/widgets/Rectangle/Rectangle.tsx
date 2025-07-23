// Rectangle.tsx
import React from "react";
import type { Widget } from "../../../types/widgets";
import * as CONSTS from "../../../shared/constants";
/* prettier-ignore */
const rectangleMetadata = {
  componentName: "Rectangle",
  category: "Basic",
  properties: {
    x:               { selType: "number",        label: "X",                default: 0 },
    y:               { selType: "number",        label: "Y",                default: 0 },
    width:           { selType: "number",        label: "Width",            default: 70 },
    height:          { selType: "number",        label: "Height",           default: 60 },
    label:           { selType: "string",        label: "Label",            default: "Rectangle" },
    backgroundColor: { selType: "colorSelector", label: "Color",            default: CONSTS.DEFAULT_COLORS.lightGray},
    borderRadius:    { selType: "number",        label: "Border Radius",    default: 1 },
    tooltip:         { selType: "string",        label: "Tooltip",          default: "" },
  }
};

type Props = {
  data: Widget;
  onClick?: () => void;
};

const Rectangle: React.FC<Props> = ({ data }) => {
  const { backgroundColor, borderRadius, tooltip } = data.properties;

  return (
    <div
      title={tooltip}
      className="rectangle"
      style={{
        width: "100%",
        height: "100%",
        backgroundColor,
        borderRadius,
      }}
    />
  );
};

export { rectangleMetadata, Rectangle };
