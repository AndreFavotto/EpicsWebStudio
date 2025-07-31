import type { WidgetProperty, PropertyValue } from "./widgets";
import { COLORS } from "../shared/constants";

/* helper to make sure each property value is correctly typed */
function defineProp<T extends PropertyValue>(prop: WidgetProperty<T>): WidgetProperty<T> {
  return prop;
}

/* prettier-ignore */
export const PROPERTY_SCHEMAS = {
  // General
  label:           defineProp({ selType: "text", label: "Label", value: "" as string, category: "General" }),
  tooltip:         defineProp({ selType: "text", label: "Tooltip", value: "" as string, category: "General" }),
  visible:         defineProp({ selType: "boolean", label: "Visible", value: true, category: "General" }),
  disabled:        defineProp({ selType: "boolean", label: "Disabled", value: false, category: "General" }),
  // Layout
  x:               defineProp({ selType: "number", label: "X", value: 100 as number, category: "Layout" }),
  y:               defineProp({ selType: "number", label: "Y", value: 100 as number, category: "Layout" }),
  width:           defineProp({ selType: "number", label: "Width", value: 100 as number, category: "Layout" }),
  height:          defineProp({ selType: "number", label: "Height", value: 40 as number, category: "Layout" }),
  zIndex:          defineProp({ selType: "number", label: "Z-Index", value: 1 as number, category: "Layout" }),
  // Style
  backgroundColor: defineProp({ selType: "colorSelector", label: "Background Color", value: COLORS.backgroundColor, category: "Style" }),
  borderColor:     defineProp({ selType: "colorSelector", label: "Border Color", value: COLORS.textColor, category: "Style" }),
  borderWidth:     defineProp({ selType: "number", label: "Border Width", value: 1 as number, category: "Style" }),
  borderRadius:    defineProp({ selType: "number", label: "Border Radius", value: 2 as number, category: "Style" }),
  borderStyle:     defineProp({ selType: "select", label: "Border Style", value: "none" as string, options: ["solid", "dashed", "dotted", "none"], category: "Style" }),
  // Font
  textColor:       defineProp({ selType: "colorSelector", label: "Text Color", value: COLORS.textColor, category: "Font" }),
  fontSize:        defineProp({ selType: "number", label: "Font Size", value: 14 as number, category: "Font" }),
  fontFamily:      defineProp({ selType: "select", label: "Font Family", value: "sans-serif" as string, options: ["serif", "sans-serif", "monospace", "fantasy", "cursive"], category: "Font" }),
  fontBold:        defineProp({ selType: "boolean", label: "Bold text", value: false, category: "Font" }),
  fontItalic:      defineProp({ selType: "boolean", label: "Italic text", value: false, category: "Font" }),
  textHAlign:      defineProp({ selType: "select", label: "Text Horiz. Align", value: "left" as string, options: ["left", "center", "right"], category: "Font" }),
  textVAlign:      defineProp({ selType: "select", label: "Text Vert. Align", value: "middle" as string, options: ["top", "middle", "bottom"], category: "Font" }),
  // Grid options
  gridLineColor:   defineProp({ selType: "colorSelector", label: "Grid Line Color", value: COLORS.gridLineColor, category: "Grid" }),
  gridLineVisible: defineProp({ selType: "boolean", label: "Grid Visible", value: true, category: "Grid" }),
  gridSize:        defineProp({ selType: "number", label: "Grid Size", value: 20 as number, category: "Grid" }),
  snapToGrid:      defineProp({ selType: "boolean", label: "Snap items", value: true, category: "Grid" }),
  // EPICS
  pvName:          defineProp({ selType: "text", label: "PV Name", value: "" as string, category: "EPICS" }),
  precisionFromPV: defineProp({ selType: "boolean", label: "Disabled", value: true, category: "EPICS" }),
  actionValue:     defineProp({ selType: "text", label: "Action Value", value: 1 as number | string, category: "EPICS" }),
};

/* property groups */
export const COMMON_PROPS = {
  //layout
  x: PROPERTY_SCHEMAS.x,
  y: PROPERTY_SCHEMAS.y,
  width: PROPERTY_SCHEMAS.width,
  height: PROPERTY_SCHEMAS.height,
  zIndex: PROPERTY_SCHEMAS.zIndex,
  //style
  backgroundColor: PROPERTY_SCHEMAS.backgroundColor,
  borderColor: PROPERTY_SCHEMAS.borderColor,
  borderStyle: PROPERTY_SCHEMAS.borderStyle,
  borderWidth: PROPERTY_SCHEMAS.borderWidth,
  borderRadius: PROPERTY_SCHEMAS.borderRadius,
  // General
  visible: PROPERTY_SCHEMAS.visible,
  tooltip: PROPERTY_SCHEMAS.tooltip,
};

export const TEXT_PROPS = {
  fontSize: PROPERTY_SCHEMAS.fontSize,
  fontFamily: PROPERTY_SCHEMAS.fontFamily,
  fontBold: PROPERTY_SCHEMAS.fontBold,
  fontItalic: PROPERTY_SCHEMAS.fontItalic,
  textColor: PROPERTY_SCHEMAS.textColor,
  textVAlign: PROPERTY_SCHEMAS.textVAlign,
  textHAlign: PROPERTY_SCHEMAS.textHAlign,
};
