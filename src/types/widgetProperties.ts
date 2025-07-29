import type { WidgetProperty, PropertyValue } from "./widgets";
import { COLORS } from "../shared/constants";

/* helper to make sure each property value is correctly typed */
function defineProp<T extends PropertyValue>(prop: WidgetProperty<T>): WidgetProperty<T> {
  return prop;
}

/* prettier-ignore */
export const PROPERTY_SCHEMAS = {
  // Label
  label:           defineProp({ selType: "text",          label: "Label",             value: ""  as string }),
  // Positioning and Layout
  x:               defineProp({ selType: "number",        label: "X",                 value: 100 as number }),
  y:               defineProp({ selType: "number",        label: "Y",                 value: 100 as number }),
  width:           defineProp({ selType: "number",        label: "Width",             value: 100 as number }),
  height:          defineProp({ selType: "number",        label: "Height",            value: 40  as number }),
  zIndex:          defineProp({ selType: "number",        label: "Z-Index",           value: 0   as number }),
  // Styling - Colors
  backgroundColor: defineProp({ selType: "colorSelector", label: "Background Color",  value: COLORS.backgroundColor }),
  textColor:       defineProp({ selType: "colorSelector", label: "Text Color",        value: COLORS.textColor }),
  borderColor:     defineProp({ selType: "colorSelector", label: "Border Color",      value: COLORS.transparent }),
  gridLineColor:   defineProp({ selType: "colorSelector", label: "Grid Line Color",   value: COLORS.gridLineColor }),
  // Styling - Borders and Shadows
  borderWidth:     defineProp({ selType: "number",        label: "Border Width",      value: 1   as number }),
  borderRadius:    defineProp({ selType: "number",        label: "Border Radius",     value: 2   as number }),
  borderStyle:     defineProp({ selType: "select",        label: "Border Style",      value: "solid", options: ["solid", "dashed", "dotted", "none"] }),
  boxShadow:       defineProp({ selType: "text",          label: "Box Shadow",        value: ""  as string }),
  // Styling - Font
  fontSize:        defineProp({ selType: "number",        label: "Font Size",         value: 14  as number }),
  fontFamily:      defineProp({ selType: "text",          label: "Font Family",       value: "Arial" as string }),
  fontWeight:      defineProp({ selType: "select",        label: "Font Weight",       value: "normal", options: ["normal", "bold", "lighter", "bolder"] }),
  textAlign:       defineProp({ selType: "select",        label: "Text Align",        value: "left", options: ["left", "center", "right"] }),
  // Interactivity
  visible:         defineProp({ selType: "boolean",       label: "Visible",           value: true }),
  tooltip:         defineProp({ selType: "text",          label: "Tooltip",           value: ""  as string }),
  disabled:        defineProp({ selType: "boolean",       label: "Disabled",          value: false }),
  // Grid options
  gridLineVisible: defineProp({ selType: "boolean",       label: "Grid Visible",      value: true }),
  gridSize:        defineProp({ selType: "number",        label: "Grid Size",         value: 20  as number }),
  snapToGrid:      defineProp({ selType: "boolean",       label: "Snap items",        value: true }),
  //EPICS
  pvName:          defineProp({ selType: "text",          label: "PV Name",           value: ""  as string }),
  precisionFromPV: defineProp({ selType: "boolean",       label: "Disabled",          value: true }),
  actionValue:     defineProp({ selType: "text",          label: "Action Value",      value: ""  as string }),
};
/* property groups */
export const COMMON_PROPS = {
  //layout
  x: PROPERTY_SCHEMAS.x,
  y: PROPERTY_SCHEMAS.y,
  width: PROPERTY_SCHEMAS.width,
  height: PROPERTY_SCHEMAS.height,
  zIndex: PROPERTY_SCHEMAS.zIndex,
  backgroundColor: PROPERTY_SCHEMAS.backgroundColor,
  //border
  borderColor: PROPERTY_SCHEMAS.borderColor,
  borderRadius: PROPERTY_SCHEMAS.borderRadius,
  borderWidth: PROPERTY_SCHEMAS.borderWidth,
  borderStyle: PROPERTY_SCHEMAS.borderStyle,
  boxShadow: PROPERTY_SCHEMAS.boxShadow,
  // Interaction
  visible: PROPERTY_SCHEMAS.visible,
  tooltip: PROPERTY_SCHEMAS.tooltip,
};

export const TEXT_PROPS = {
  fontSize: PROPERTY_SCHEMAS.fontSize,
  fontFamily: PROPERTY_SCHEMAS.fontFamily,
  fontWeight: PROPERTY_SCHEMAS.fontWeight,
  textColor: PROPERTY_SCHEMAS.textColor,
  textAlign: PROPERTY_SCHEMAS.textAlign,
};
