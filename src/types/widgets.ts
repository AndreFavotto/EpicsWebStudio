export type PalleteEntry = {
  widgetLabel: string;
  componentName: string;
};

export type Widget = {
  id: string;
  componentName: string;
  properties: Record<string, any>;
};
