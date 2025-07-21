// Circle.tsx
import React from "react";
import type { Widget } from "../../../types/widgets";
import { useEditorContext } from "../../Utils/EditorContext";
import * as CONSTS from "../../../shared/constants";

const circleMetadata = {
  componentName: "Circle",
  category: "Basic",
  properties: {
    x:               { selType: "number",        label: "X",          default: 0 },
    y:               { selType: "number",        label: "Y",          default: 0 },
    width:           { selType: "number",        label: "Width",      default: 80 },
    height:          { selType: "number",        label: "Height",     default: 80 },
    label:           { selType: "string",        label: "Label",      default: "Circle" },
    backgroundColor: { selType: "colorSelector", label: "Color",      default: "#cccccc" },
    tooltip:         { selType: "string",        label: "Tooltip",    default: "" },
  }
};

type Props = {
  data: Widget;
  onClick?: () => void;
};

const Circle: React.FC<Props> = ({ data }) => {
  const { mode, selectWidget } = useEditorContext();
  const {
    backgroundColor,
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
      onClick={handleClick}
      style={{
        width: "100%",
        height: "100%",
        backgroundColor,
        borderRadius: "50%",
      }}
    />
  );
};

export { circleMetadata, Circle };
