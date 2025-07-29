import { InputFieldComp } from "./InputFieldComp";
import { COLORS } from "../../../shared/constants";
import type { Widget } from "../../../types/widgets";
import InputIcon from "@mui/icons-material/Input";
import { PROPERTY_SCHEMAS, COMMON_PROPS, TEXT_PROPS } from "../../../types/widgetProperties";

export const InputField: Widget = {
  id: "__InputField__",
  component: InputFieldComp,
  widgetName: "InputField",
  widgetIcon: InputIcon,
  widgetLabel: "Input Field",
  category: "Controls",
  editableProperties: {
    ...COMMON_PROPS,
    ...TEXT_PROPS,
    backgroundColor: { ...PROPERTY_SCHEMAS.backgroundColor, value: COLORS.inputColor },
  },
} as const;
