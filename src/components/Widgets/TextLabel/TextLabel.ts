import { COLORS } from "../../../shared/constants";
import type { Widget } from "../../../types/widgets";
import { PROPERTY_SCHEMAS } from "../../../types/widgets";
import { TextLabelComp } from "./TextLabelComp";

export const TextLabel: Widget = {
  id: "__TextLabel__",
  componentName: "TextLabel",
  component: TextLabelComp,
  widgetLabel: "Text Label",
  category: "Basic",
  editableProperties: {
    x: PROPERTY_SCHEMAS.x,
    y: PROPERTY_SCHEMAS.y,
    width: { ...PROPERTY_SCHEMAS.width, value: 80 },
    height: { ...PROPERTY_SCHEMAS.height, value: 30 },
    label: { ...PROPERTY_SCHEMAS.label, value: "Text Label" },
    textColor: PROPERTY_SCHEMAS.textColor,
    fontSize: PROPERTY_SCHEMAS.fontSize,
    borderRadius: PROPERTY_SCHEMAS.borderRadius,
    backgroundColor: { ...PROPERTY_SCHEMAS.backgroundColor, value: COLORS.transparent },
    tooltip: PROPERTY_SCHEMAS.tooltip,
  },
} as const;
