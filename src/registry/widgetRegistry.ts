import { buttonMetadata, ButtonWidget } from "../components/widgets/ButtonWidget/ButtonWidget";
import { labelMetadata, LabelWidget } from "../components/widgets/LabelWidget/LabelWidget";
import { textInputMetadata, TextInputWidget } from "../components/widgets/TextInputWidget/TextInputWidget";

export const widgetRegistry = {
  [buttonMetadata.componentName]: {
    metadata: buttonMetadata,
    component: ButtonWidget,
  },
  [labelMetadata.componentName]: {
    metadata: labelMetadata,
    component: LabelWidget,
  },
  [textInputMetadata.componentName]: {
    metadata: textInputMetadata,
    component: TextInputWidget,
  },
};