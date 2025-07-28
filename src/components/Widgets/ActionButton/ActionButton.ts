import { ActionButtonComp } from "./ActionButtonComp";
import { PROPERTY_SCHEMAS } from "../../../types/widgets";
import { COLORS } from "../../../shared/constants";
import type { Widget } from "../../../types/widgets";
import SendIcon from "@mui/icons-material/Send";

export const ActionButton: Widget = {
  id: "__ActionButton__",
  component: ActionButtonComp,
  widgetName: "ActionButton",
  widgetIcon: SendIcon,
  widgetLabel: "Action Button",
  category: "Controls",
  editableProperties: {
    x: PROPERTY_SCHEMAS.x,
    y: PROPERTY_SCHEMAS.y,
    width: { ...PROPERTY_SCHEMAS.width, value: 120 },
    height: { ...PROPERTY_SCHEMAS.height, value: 40 },
    label: { ...PROPERTY_SCHEMAS.label, value: "Action Button" },
    backgroundColor: { ...PROPERTY_SCHEMAS.backgroundColor, value: COLORS.buttonColor },
    textColor: PROPERTY_SCHEMAS.textColor,
    fontSize: PROPERTY_SCHEMAS.fontSize,
    borderRadius: PROPERTY_SCHEMAS.borderRadius,
    actionValue: PROPERTY_SCHEMAS.actionValue,
    pvName: PROPERTY_SCHEMAS.pvName,
    tooltip: PROPERTY_SCHEMAS.tooltip,
    disabled: PROPERTY_SCHEMAS.disabled,
  },
} as const;
