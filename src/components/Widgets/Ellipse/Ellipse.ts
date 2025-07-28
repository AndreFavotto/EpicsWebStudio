import { COLORS } from "../../../shared/constants";
import type { Widget } from "../../../types/widgets";
import { PROPERTY_SCHEMAS } from "../../../types/widgets";
import { EllipseComp } from "./EllipseComp";
import CircleIcon from "@mui/icons-material/Circle";

export const Ellipse: Widget = {
  id: "__Ellipse__",
  component: EllipseComp,
  widgetName: "Ellipse",
  widgetIcon: CircleIcon,
  widgetLabel: "Ellipse",
  category: "Basic",
  editableProperties: {
    x: PROPERTY_SCHEMAS.x,
    y: PROPERTY_SCHEMAS.y,
    width: { ...PROPERTY_SCHEMAS.width, value: 80 },
    height: { ...PROPERTY_SCHEMAS.height, value: 80 },
    label: { ...PROPERTY_SCHEMAS.label, value: "Ellipse" },
    backgroundColor: { ...PROPERTY_SCHEMAS.backgroundColor, value: COLORS.lightGray },
    tooltip: PROPERTY_SCHEMAS.tooltip,
  },
} as const;
