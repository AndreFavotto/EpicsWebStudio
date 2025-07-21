import React from "react";
import type { Widget } from "../../../types/widgets";
import { useEditorContext } from "../../Utils/EditorContext";
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
  // Optional callbacks for builder mode (drag/resize handlers, click, etc)
  onClick?: () => void;
};

const TextLabel: React.FC<Props> = ({ data }) => {
  const { mode, selectWidget } = useEditorContext();
      const {
        label,
        backgroundColor,
        textColor,
        borderRadius,
        fontSize,
        disabled,
        tooltip,
      } = data.properties;
      const handleClick = (e: React.MouseEvent) => {
        if (mode === CONSTS.EDIT_MODE) {
          e.stopPropagation();
          selectWidget(data.id);
        }
      };
    return (
    <div className="textLabel"
         onClick= {handleClick}
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