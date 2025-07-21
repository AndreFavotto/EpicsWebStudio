import { actionButtonMetadata, ActionButton } from "../widgets/ActionButton/ActionButton";
import { labelMetadata, TextLabel } from "../widgets/TextLabel/TextLabel";
import { textInputMetadata, TextInput } from "../widgets/TextInput/TextInput";
import { textUpdateMetadata, TextUpdate } from "../widgets/TextUpdate/TextUpdate";
import { circleMetadata, Circle } from "../widgets/Circle/Circle";
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
  [circleMetadata.componentName]: {
    properties: circleMetadata.properties,
    component: Circle,
    category: circleMetadata.category,
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