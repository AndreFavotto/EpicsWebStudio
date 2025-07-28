import { InputFieldComp } from "./InputFieldComp";
import { PROPERTY_SCHEMAS } from "../../../types/widgets";
import { COLORS } from "../../../shared/constants";
import type { Widget } from "../../../types/widgets";
import InputIcon from "@mui/icons-material/Input";

export const InputField: Widget = {
  id: "__InputField__",
  component: InputFieldComp,
  widgetName: "InputField",
  widgetIcon: InputIcon,
  widgetLabel: "Input Field",
  category: "Controls",
  editableProperties: {
    x: PROPERTY_SCHEMAS.x,
    y: PROPERTY_SCHEMAS.y,
    width: { ...PROPERTY_SCHEMAS.width, value: 120 },
    height: { ...PROPERTY_SCHEMAS.height, value: 40 },
    label: { ...PROPERTY_SCHEMAS.label, value: "Input Field" },
    backgroundColor: { ...PROPERTY_SCHEMAS.backgroundColor, value: COLORS.inputColor },
    textColor: PROPERTY_SCHEMAS.textColor,
    borderRadius: PROPERTY_SCHEMAS.borderRadius,
    pvName: PROPERTY_SCHEMAS.pvName,
    tooltip: PROPERTY_SCHEMAS.tooltip,
    disabled: PROPERTY_SCHEMAS.disabled,
  },
} as const;
