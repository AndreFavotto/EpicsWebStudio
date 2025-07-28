import { COLORS } from "../../../shared/constants";
import type { Widget } from "../../../types/widgets";
import { PROPERTY_SCHEMAS } from "../../../types/widgets";
import { RectangleComp } from "./RectangleComp";
import RectangleIcon from "@mui/icons-material/Rectangle";

export const Rectangle: Widget = {
  id: "__Rectangle__",
  component: RectangleComp,
  widgetName: "Rectangle",
  widgetIcon: RectangleIcon,
  widgetLabel: "Rectangle",
  category: "Basic",
  editableProperties: {
    x: PROPERTY_SCHEMAS.x,
    y: PROPERTY_SCHEMAS.y,
    width: { ...PROPERTY_SCHEMAS.width, value: 80 },
    height: { ...PROPERTY_SCHEMAS.height, value: 80 },
    label: { ...PROPERTY_SCHEMAS.label, value: "Rectangle" },
    backgroundColor: { ...PROPERTY_SCHEMAS.backgroundColor, value: COLORS.lightGray },
    borderRadius: { ...PROPERTY_SCHEMAS.borderRadius, value: 2 },
    tooltip: PROPERTY_SCHEMAS.tooltip,
  },
} as const;
