import { ActionButtonComp } from "./ActionButtonComp";
import { COMMON_PROPS, PROPERTY_SCHEMAS, TEXT_PROPS } from "../../../types/widgetProperties";
import type { Widget } from "../../../types/widgets";
import SendIcon from "@mui/icons-material/Send";
import { COLORS } from "../../../shared/constants";

export const ActionButton: Widget = {
  id: "__ActionButton__",
  component: ActionButtonComp,
  widgetName: "ActionButton",
  widgetIcon: SendIcon,
  widgetLabel: "Action Button",
  category: "Controls",
  editableProperties: {
    ...COMMON_PROPS,
    ...TEXT_PROPS,
    label: { ...PROPERTY_SCHEMAS.label, value: "Action Button" },
    backgroundColor: { ...PROPERTY_SCHEMAS.backgroundColor, value: COLORS.buttonColor },
    pvName: PROPERTY_SCHEMAS.pvName,
    disabled: PROPERTY_SCHEMAS.disabled,
    actionValue: PROPERTY_SCHEMAS.actionValue,
  },
} as const;
