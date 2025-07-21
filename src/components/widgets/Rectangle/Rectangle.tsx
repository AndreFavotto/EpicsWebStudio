// Rectangle.tsx
import React from "react";
import type { Widget } from "../../../types/widgets";
import { useEditorContext } from "../../Utils/EditorContext";
import * as CONSTS from "../../../shared/constants";

const rectangleMetadata = {
  componentName: "Rectangle",
  category: "Basic",
  properties: {
    x:               { selType: "number",        label: "X",                default: 0 },
    y:               { selType: "number",        label: "Y",                default: 0 },
    width:           { selType: "number",        label: "Width",            default: 70 },
    height:          { selType: "number",        label: "Height",           default: 60 },
    label:           { selType: "string",        label: "Label",            default: "Rectangle" },
    backgroundColor: { selType: "colorSelector", label: "Color",            default: "#cccccc" },
    borderRadius:    { selType: "number",        label: "Border Radius",    default: 1 },
    tooltip:         { selType: "string",        label: "Tooltip",          default: "" },
  }
};

type Props = {
  data: Widget;
  onClick?: () => void;
};

const Rectangle: React.FC<Props> = ({ data }) => {
  const { mode, selectWidget } = useEditorContext();
  const {
    backgroundColor,
    borderRadius,
    tooltip,
  } = data.properties;

  const handleClick = (e: React.MouseEvent) => {
    if (mode === CONSTS.EDIT_MODE) {
      e.stopPropagation();
      selectWidget(data.id);
    }
  };

  return (
    <div
      title={tooltip}
      className="rectangle"
      onClick={handleClick}
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
