import { buttonMetadata, ButtonWidget } from "../widgets/ButtonWidget/ButtonWidget";
import { labelMetadata, LabelWidget } from "../widgets/LabelWidget/LabelWidget";
import { textInputMetadata, TextInputWidget } from "../widgets/TextInputWidget/TextInputWidget";

export const widgetRegistry = {
  [buttonMetadata.componentName]: {
    properties: buttonMetadata.properties,
    component: ButtonWidget,
  },
  [labelMetadata.componentName]: {
    properties: labelMetadata.properties,
    component: LabelWidget,
  },
  [textInputMetadata.componentName]: {
    properties: textInputMetadata.properties,
    component: TextInputWidget,
  },
};