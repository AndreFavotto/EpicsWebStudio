import type { WidgetProperty, PropertyValue, WidgetProperties } from "./widgets";
import { COLORS } from "../constants/constants";
import type { PVValue } from "./pvaPyWS";

/* helper to make sure each property value is correctly typed */
function defineProp<T extends PropertyValue>(prop: WidgetProperty<T>): WidgetProperty<T> {
  return prop;
}

/* prettier-ignore */
export const PROPERTY_SCHEMAS = {
  // Shared Properties
  disabled:        defineProp({ selType: "boolean", label: "Disabled", value: false as boolean, category: "Other" }),
  // Layout
  x:               defineProp({ selType: "number", label: "X", value: 100 as number, category: "Layout" }),
  y:               defineProp({ selType: "number", label: "Y", value: 100 as number, category: "Layout" }),
  width:           defineProp({ selType: "number", label: "Width", value: 100 as number, category: "Layout" }),
  height:          defineProp({ selType: "number", label: "Height", value: 40 as number, category: "Layout" }),
  label:           defineProp({ selType: "text", label: "Label", value: "" as string, category: "Layout" }),
  tooltip:         defineProp({ selType: "text", label: "Tooltip", value: "" as string, category: "Layout" }),
  visible:         defineProp({ selType: "boolean", label: "Visible", value: true as boolean, category: "Layout" }),
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
  fontBold:        defineProp({ selType: "boolean", label: "Bold text", value: false as boolean, category: "Font" }),
  fontItalic:      defineProp({ selType: "boolean", label: "Italic text", value: false as boolean, category: "Font" }),
  textHAlign:      defineProp({ selType: "select", label: "Text Horiz. Align", value: "left" as string, options: ["left", "center", "right"], category: "Font" }),
  textVAlign:      defineProp({ selType: "select", label: "Text Vert. Align", value: "middle" as string, options: ["top", "middle", "bottom"], category: "Font" }),
  // Grid options
  gridLineColor:   defineProp({ selType: "colorSelector", label: "Grid Line Color", value: COLORS.gridLineColor, category: "Grid" }),
  gridLineVisible: defineProp({ selType: "boolean", label: "Grid Visible", value: true as boolean, category: "Grid" }),
  gridSize:        defineProp({ selType: "number", label: "Grid Size", value: 20 as number, category: "Grid" }),
  snapToGrid:      defineProp({ selType: "boolean", label: "Snap items", value: true as boolean, category: "Grid" }),
  // Window options
  windowWidth:     defineProp({ selType: "number", label: "Window Width", value: 1280 as number, category: "Window" }),
  windowHeight:    defineProp({ selType: "number", label: "Window Height", value: 720 as number, category: "Window" }),
  // EPICS
  pvName:          defineProp({ selType: "text", label: "PV Name", value: "" as string, category: "EPICS" }),
  precisionFromPV: defineProp({ selType: "boolean", label: "Disabled", value: true as boolean, category: "EPICS" }),
  actionValue:     defineProp({ selType: "text", label: "Action Value", value: 1 as number | string, category: "EPICS" }),
  pvValue:         defineProp({ selType: "none", label: "PV Value", value: "" as PVValue, category: "EPICS" }),
  // placeholder for number array - needed for now to match all types in PropertyValue
  placeholder:     defineProp({ selType: "select", label: "placeholder prop", value: [] as number[], category: "placeholder" }),
  // Specific Properties
  // BitIndicator
  orientation:     defineProp({ selType: "select", label: "Orientation", value: "Vertical" as string, options: ["Vertical", "Horizontal"], category: "Layout" }),
  nBits:           defineProp({ selType: "number", label: "Number of bits", value: 1 as number, category: "Layout" }),
  invertBitOrder:  defineProp({ selType: "boolean", label: "Invert bit order", value: false as boolean, category: "Layout" }),
  onColor:         defineProp({ selType: "colorSelector", label: "On Color", value: COLORS.onColor, category: "Style" }),
  offColor:        defineProp({ selType: "colorSelector", label: "Off Color", value: COLORS.offColor, category: "Style" }),
  spacing:         defineProp({ selType: "number", label: "Spacing", value: 1 as number, category: "Style" }),
  square:          defineProp({ selType: "boolean", label: "Square", value: false as boolean, category: "Style" }),
  //Graph
  lineColor:       defineProp({ selType: "colorSelector", label: "Line Color", value: COLORS.graphLineColor, category: "Style" }),
  plotTitle:       defineProp({ selType: "text", label: "Title", value: "Title" as string, category: "Layout" }),
  xAxisTitle:      defineProp({ selType: "text", label: "X axis title", value: "Time" as string, category: "Layout" }),
  yAxisTitle:      defineProp({ selType: "text", label: "Y axis title", value: "Y axis" as string, category: "Layout" }),
  logscaleY:       defineProp({ selType: "boolean", label: "Apply log to Y", value: false as boolean, category: "Layout" }),
  plotLineStyle:   defineProp({ selType: "select", label: "Line style", value: "lines+markers" as "lines+markers"|"lines"|"markers", options: ["lines+markers", "lines", "markers"], category: "Style" }),
  xAxisPVName:     defineProp({ selType: "text", label: "X axis PV", value: "" as string, category: "EPICS" }),
  xAxisPVValue:    defineProp({ selType: "none", label: "X axis PV value", value: "" as PVValue, category: "EPICS" }),
  plotBufferSize:  defineProp({ selType: "number", label: "Buffer size (if scalar PVs)", value: 50 as number, category: "Layout" }),
};

export const CATEGORY_DISPLAY_ORDER = ["Grid", "Layout", "Style", "Font", "General", "EPICS", "Window", "Other"];

/* property groups */
export const COMMON_PROPS: WidgetProperties = {
  //layout
  x: PROPERTY_SCHEMAS.x,
  y: PROPERTY_SCHEMAS.y,
  width: PROPERTY_SCHEMAS.width,
  height: PROPERTY_SCHEMAS.height,
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

export const TEXT_PROPS: WidgetProperties = {
  fontSize: PROPERTY_SCHEMAS.fontSize,
  fontFamily: PROPERTY_SCHEMAS.fontFamily,
  fontBold: PROPERTY_SCHEMAS.fontBold,
  fontItalic: PROPERTY_SCHEMAS.fontItalic,
  textColor: PROPERTY_SCHEMAS.textColor,
  textVAlign: PROPERTY_SCHEMAS.textVAlign,
  textHAlign: PROPERTY_SCHEMAS.textHAlign,
};

export const PLOT_PROPS: WidgetProperties = {
  backgroundColor: { ...PROPERTY_SCHEMAS.backgroundColor, value: COLORS.white },
  lineColor: PROPERTY_SCHEMAS.lineColor,
  plotTitle: PROPERTY_SCHEMAS.plotTitle,
  xAxisTitle: PROPERTY_SCHEMAS.xAxisTitle,
  yAxisTitle: PROPERTY_SCHEMAS.yAxisTitle,
  plotLineStyle: PROPERTY_SCHEMAS.plotLineStyle,
  logscaleY: PROPERTY_SCHEMAS.logscaleY,
  xAxisPVName: PROPERTY_SCHEMAS.xAxisPVName,
  xAxisPVValue: PROPERTY_SCHEMAS.xAxisPVValue,
  plotBufferSize: PROPERTY_SCHEMAS.plotBufferSize,
};
