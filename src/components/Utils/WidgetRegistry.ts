import * as Widgets from "../../components/Widgets";
import type { Widget } from "../../types/widgets";

const WidgetRegistry = Widgets as Record<string, Widget>;
export default WidgetRegistry;
