import type { SvgIconProps } from "@mui/material/SvgIcon";
import { PROPERTY_SCHEMAS } from "./widgetProperties";
import type { MultiPvData, PVData } from "./pvaPyWS";

export type PropertySelectorType = "text" | "number" | "boolean" | "colorSelector" | "select" | "pvList" | "none";
export type PropertyValue = string | number | boolean | Record<string, string>;
export interface WidgetProperty<T extends PropertyValue = PropertyValue> {
  selType: PropertySelectorType;
  label: string;
  value: T; //template (either one of PropertyValue types)
  category: string;
  options?: string[];
}

export type PropertyKey = keyof typeof PROPERTY_SCHEMAS;

export type WidgetProperties = Partial<typeof PROPERTY_SCHEMAS>;

export type PropertyUpdates = Partial<Record<PropertyKey, PropertyValue>>;

export type MultiWidgetPropertyUpdates = Record<string, PropertyUpdates>;

export interface WidgetUpdate {
  data: Widget;
}
export type WidgetIconType = React.FC<SvgIconProps>;

export interface Widget {
  id: string;
  widgetLabel: string;
  widgetIcon?: WidgetIconType;
  pvData?: PVData;
  multiPvData?: MultiPvData;
  widgetName: string;
  component: React.FC<WidgetUpdate>;
  category: string;
  editableProperties: WidgetProperties;
}

export interface ExportedWidget {
  id: string;
  widgetName: string;
  properties: Partial<Record<PropertyKey, PropertyValue>>;
}

export interface GridPosition {
  x: number;
  y: number;
}
