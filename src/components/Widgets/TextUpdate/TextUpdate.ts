import { TextUpdateComp } from "./TextUpdateComp";
import { PROPERTY_SCHEMAS, COMMON_PROPS, TEXT_PROPS } from "../../../types/widgetProperties";
import { COLORS } from "../../../constants/constants";
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
    ...COMMON_PROPS,
    ...TEXT_PROPS,
    label: { ...PROPERTY_SCHEMAS.label, value: "Text Update" },
    backgroundColor: { ...PROPERTY_SCHEMAS.backgroundColor, value: COLORS.readColor },
    pvName: PROPERTY_SCHEMAS.pvName,
    pvValue: PROPERTY_SCHEMAS.pvValue,
  },
} as const;
