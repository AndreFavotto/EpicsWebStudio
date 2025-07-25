import { TextInputComp } from "./TextInputComp";
import { PROPERTY_SCHEMAS } from "../../../types/widgets";
import { COLORS } from "../../../shared/constants";
import type { Widget } from "../../../types/widgets";

export const TextInput: Widget = {
  id: "__TextInput__",
  componentName: "TextInput",
  component: TextInputComp,
  widgetLabel: "Text Input",
  category: "Controls",
  editableProperties: {
    x: PROPERTY_SCHEMAS.x,
    y: PROPERTY_SCHEMAS.y,
    width: { ...PROPERTY_SCHEMAS.width, value: 120 },
    height: { ...PROPERTY_SCHEMAS.height, value: 40 },
    label: { ...PROPERTY_SCHEMAS.label, value: "Text Input" },
    backgroundColor: { ...PROPERTY_SCHEMAS.backgroundColor, value: COLORS.inputColor },
    textColor: PROPERTY_SCHEMAS.textColor,
    borderRadius: PROPERTY_SCHEMAS.borderRadius,
    pvName: PROPERTY_SCHEMAS.pvName,
    tooltip: PROPERTY_SCHEMAS.tooltip,
    disabled: PROPERTY_SCHEMAS.disabled,
  },
} as const;
