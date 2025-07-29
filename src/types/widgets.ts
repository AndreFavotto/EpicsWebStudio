import { COLORS } from "../shared/constants";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import type { PVWSMessageValue } from "./pvws";

export type PropertySelectorType = "text" | "number" | "boolean" | "colorSelector" | "select";
export type PropertyValue = string | number | number[] | boolean;
export interface WidgetProperty<T extends PropertyValue = PropertyValue> {
  selType: PropertySelectorType;
  label: string;
  value: T; //template (either one of PropertyValue types)
  options?: string[];
}

/* helper to make sure each property value is correctly typed */
function defineProp<T extends PropertyValue>(prop: WidgetProperty<T>): WidgetProperty<T> {
  return prop;
}

/* prettier-ignore */
export const PROPERTY_SCHEMAS = {
  x:               defineProp({ selType: "number",        label: "X",                value: 100 as number }),
  y:               defineProp({ selType: "number",        label: "Y",                value: 100 as number }),
  height:          defineProp({ selType: "number",        label: "Height",           value: 40 as number }),
  width:           defineProp({ selType: "number",        label: "Width",            value: 100 as number }),
  pvName:          defineProp({ selType: "text",          label: "PV Name",          value: "" as string }),
  disabled:        defineProp({ selType: "boolean",       label: "Disabled",         value: false }),
  backgroundColor: defineProp({ selType: "colorSelector", label: "Background Color", value: COLORS.backgroundColor }),
  textColor:       defineProp({ selType: "colorSelector", label: "Text Color",       value: COLORS.textColor }),
  fontSize:        defineProp({ selType: "number",        label: "Font Size",        value: 14 as number }),
  borderRadius:    defineProp({ selType: "number",        label: "Border Radius",    value: 2  as number }),
  label:           defineProp({ selType: "text",          label: "Label",            value: ""  as string }),
  actionValue:     defineProp({ selType: "text",          label: "Action Value",     value: ""  as string }),
  tooltip:         defineProp({ selType: "text",          label: "Tooltip",          value: ""  as string }),
  gridLineColor:   defineProp({ selType: "colorSelector", label: "Grid Line Color",  value: COLORS.gridLineColor }),
  gridLineVisible: defineProp({ selType: "boolean",       label: "Grid Visible",     value: true }),
  gridSize:        defineProp({ selType: "number",        label: "Grid Size",        value: 20 as number }),
  snapToGrid:      defineProp({ selType: "boolean",       label: "Snap items",       value: true }),
};

export type PropertyKey = keyof typeof PROPERTY_SCHEMAS;

export type WidgetProperties = Partial<typeof PROPERTY_SCHEMAS>;

export interface WidgetUpdate {
  data: Widget;
}
export type WidgetIconType = React.FC<SvgIconProps>;
export interface Widget {
  id: string;
  widgetLabel: string;
  widgetIcon?: WidgetIconType;
  widgetName: string;
  component: React.FC<WidgetUpdate>;
  category: string;
  pvValue?: PVWSMessageValue;
  editableProperties: WidgetProperties;
}
