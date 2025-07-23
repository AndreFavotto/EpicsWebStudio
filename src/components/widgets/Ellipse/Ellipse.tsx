// Ellipse.tsx
import React from "react";
import type { Widget } from "../../../types/widgets";
import * as CONSTS from "../../../shared/constants";
/* prettier-ignore */
const ellipseMetadata = {
  componentName: "Ellipse",
  category: "Basic",
  properties: {
    x:               { selType: "number",        label: "X",          default: 0 },
    y:               { selType: "number",        label: "Y",          default: 0 },
    width:           { selType: "number",        label: "Width",      default: 80 },
    height:          { selType: "number",        label: "Height",     default: 80 },
    label:           { selType: "string",        label: "Label",      default: "Ellipse" },
    backgroundColor: { selType: "colorSelector", label: "Color",      default: CONSTS.DEFAULT_COLORS.lightGray },
    tooltip:         { selType: "string",        label: "Tooltip",    default: "" },
  }
};

type Props = {
  data: Widget;
};

const Ellipse: React.FC<Props> = ({ data }) => {
  const { backgroundColor, tooltip } = data.properties;

  return (
    <div
      title={tooltip}
      style={{
        width: "100%",
        height: "100%",
        backgroundColor,
        borderRadius: "50%",
      }}
    />
  );
};

export { ellipseMetadata, Ellipse };
