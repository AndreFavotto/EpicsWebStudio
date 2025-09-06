import type { SvgIconProps } from "@mui/material/SvgIcon";
import { PROPERTY_SCHEMAS } from "./widgetProperties";
import type { MultiPvData, PVData } from "./pvaPyWS";

/**
 * Selector types for widget properties.
 * Possible values:
 * - "text": text input
 * - "number": numeric input
 * - "boolean": checkbox
 * - "colorSelector": color picker
 * - "select": dropdown selection
 * - "pvList": list of PVs (text input)
 * - "none": no selector (property not displayed)
 */
export type PropertySelectorType = "text" | "number" | "boolean" | "colorSelector" | "select" | "pvList" | "none";

/** Allowed values for a widget property: string, number, boolean, or string dictionary */
export type PropertyValue = string | number | boolean | Record<string, string>;

/**
 * Represents a single widget property.
 * @template T Type of the property value
 * @property selType Type of input selector for this property
 * @property label Label to display in the UI
 * @property value Current or default value of the property
 * @property category Category of the property for grouping in the editor
 * @property options Optional list of string options (used for dropdown/select)
 */
export interface WidgetProperty<T extends PropertyValue = PropertyValue> {
  selType: PropertySelectorType;
  label: string;
  value: T;
  category: string;
  options?: string[];
}

/** Keys of the PROPERTY_SCHEMAS object */
export type PropertyKey = keyof typeof PROPERTY_SCHEMAS;

/** Partial subset of all widget properties */
export type WidgetProperties = Partial<typeof PROPERTY_SCHEMAS>;

/**
 * Updates to a single widget's properties.
 * @property [propertyKey: PropertyKey] New value for each widget property
 * Example:
 * ```ts
 * const updates: PropertyUpdates = { label: "New Label", visible: true };
 * ```
 */
export type PropertyUpdates = Partial<Record<PropertyKey, PropertyValue>>;

/**
 * Updates for multiple widgets.
 * @property [widgetId: string] Set of property updates for that widget
 * Example:
 * ```ts
 * const multiUpdates: MultiWidgetPropertyUpdates = {
 *   "widget1": { label: "Updated", height: 40 },
 *   "widget2": { backgroundColor: "#00ff00" }
 * };
 * ```
 */
export type MultiWidgetPropertyUpdates = Record<string, PropertyUpdates>;

/**
 * Wrapper for a widget update event.
 * @property data The widget being updated
 */
export interface WidgetUpdate {
  data: Widget;
}

/** Type alias for a MUI icon component used as a widget icon */
export type WidgetIconType = React.FC<SvgIconProps>;

/**
 * Represents a widget definition in the editor.
 * @property id Unique identifier for the widget instance
 * @property widgetLabel Label to display in the UI
 * @property widgetIcon Optional icon component
 * @property pvData Optional current PV data
 * @property multiPvData Optional PV data for multiple PVs
 * @property widgetName Internal widget name
 * @property component React component used to render the widget
 * @property category Category of the widget (for grouping in UI)
 * @property editableProperties Editable properties of the widget
 */
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

/**
 * Simplified representation of a widget for export.
 * @property id Widget ID
 * @property widgetName Widget name
 * @property properties Partial properties of the widget
 */
export interface ExportedWidget {
  id: string;
  widgetName: string;
  properties: Partial<Record<PropertyKey, PropertyValue>>;
}

/**
 * Represents the position of a widget on a grid layout.
 * @property x X coordinate on the grid
 * @property y Y coordinate on the grid
 */
export interface GridPosition {
  x: number;
  y: number;
}
