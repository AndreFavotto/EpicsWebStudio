import { GRID_ID } from "../../constants/constants";
import { PROPERTY_SCHEMAS } from "../../types/widgetProperties";
import type { Widget } from "../../types/widgets";
import { GridZoneComp } from "./GridZoneComp";

// not added to registry, but treated as a special type of widget for consistency
export const GridZone: Widget = {
  id: GRID_ID,
  component: GridZoneComp,
  widgetName: "GridZone",
  widgetLabel: "GridZone",
  category: "Grid",
  editableProperties: {
    backgroundColor: PROPERTY_SCHEMAS.backgroundColor,
    gridLineColor: PROPERTY_SCHEMAS.gridLineColor,
    gridSize: PROPERTY_SCHEMAS.gridSize,
    gridLineVisible: PROPERTY_SCHEMAS.gridLineVisible,
    snapToGrid: PROPERTY_SCHEMAS.snapToGrid,
    windowWidth: PROPERTY_SCHEMAS.windowWidth,
    windowHeight: PROPERTY_SCHEMAS.windowHeight,
  },
} as const;
