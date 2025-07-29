import type { SvgIconProps } from "@mui/material/SvgIcon";
import { PROPERTY_SCHEMAS } from "./widgetProperties";
import type { PVWSMessageValue } from "./pvws";

export type PropertySelectorType = "text" | "number" | "boolean" | "colorSelector" | "select";
export type PropertyValue = string | number | number[] | boolean;
export interface WidgetProperty<T extends PropertyValue = PropertyValue> {
  selType: PropertySelectorType;
  label: string;
  value: T; //template (either one of PropertyValue types)
  options?: string[];
}

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
