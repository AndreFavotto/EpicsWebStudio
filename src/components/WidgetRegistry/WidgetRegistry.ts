import * as Widgets from "../../components/Widgets";
import type { Widget } from "../../types/widgets";

/**
 * WidgetRegistry is a centralized mapping of widget names to their corresponding widget definitions.
 * This registry is used by the editor to dynamically instantiate and render widgets.
 */
const WidgetRegistry = Widgets as Record<string, Widget>;
export default WidgetRegistry;
