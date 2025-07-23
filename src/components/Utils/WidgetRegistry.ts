import { actionButtonMetadata, ActionButton } from "../widgets/ActionButton/ActionButton";
import { labelMetadata, TextLabel } from "../widgets/TextLabel/TextLabel";
import { textInputMetadata, TextInput } from "../widgets/TextInput/TextInput";
import { textUpdateMetadata, TextUpdate } from "../widgets/TextUpdate/TextUpdate";
import { ellipseMetadata, Ellipse } from "../widgets/Ellipse/Ellipse";
import { rectangleMetadata, Rectangle } from "../widgets/Rectangle/Rectangle";

export const widgetRegistry = {
  [actionButtonMetadata.componentName]: {
    properties: actionButtonMetadata.properties,
    component: ActionButton,
    category: actionButtonMetadata.category,
  },
  [labelMetadata.componentName]: {
    properties: labelMetadata.properties,
    component: TextLabel,
    category: labelMetadata.category,
  },
  [ellipseMetadata.componentName]: {
    properties: ellipseMetadata.properties,
    component: Ellipse,
    category: ellipseMetadata.category,
  },
  [rectangleMetadata.componentName]: {
    properties: rectangleMetadata.properties,
    component: Rectangle,
    category: rectangleMetadata.category,
  },
  [textInputMetadata.componentName]: {
    properties: textInputMetadata.properties,
    component: TextInput,
    category: textInputMetadata.category,
  },
  [textUpdateMetadata.componentName]: {
    properties: textUpdateMetadata.properties,
    component: TextUpdate,
    category: textUpdateMetadata.category,
  },
};
