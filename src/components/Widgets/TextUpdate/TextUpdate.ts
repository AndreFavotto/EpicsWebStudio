import { TextUpdateComp } from "./TextUpdateComp";
import { PROPERTY_SCHEMAS } from "../../../types/widgets";
import { COLORS } from "../../../shared/constants";
import type { Widget } from "../../../types/widgets";
import TextsmsIcon from "@mui/icons-material/Textsms";

export const TextUpdate: Widget = {
  id: "__TextUpdate__",
  component: TextUpdateComp,
  widgetName: "TextUpdate",
  widgetIcon: TextsmsIcon,
  widgetLabel: "Text Update",
  category: "Monitoring",
  editableProperties: {
    x: PROPERTY_SCHEMAS.x,
    y: PROPERTY_SCHEMAS.y,
    tooltip: PROPERTY_SCHEMAS.tooltip,
    width: { ...PROPERTY_SCHEMAS.width, value: 120 },
    height: { ...PROPERTY_SCHEMAS.height, value: 40 },
    label: { ...PROPERTY_SCHEMAS.label, value: "Text Update" },
    backgroundColor: { ...PROPERTY_SCHEMAS.backgroundColor, value: COLORS.readColor },
    textColor: PROPERTY_SCHEMAS.textColor,
    fontSize: PROPERTY_SCHEMAS.fontSize,
    borderRadius: PROPERTY_SCHEMAS.borderRadius,
    actionValue: PROPERTY_SCHEMAS.actionValue,
    pvName: PROPERTY_SCHEMAS.pvName,
    disabled: PROPERTY_SCHEMAS.disabled,
  },
} as const;
