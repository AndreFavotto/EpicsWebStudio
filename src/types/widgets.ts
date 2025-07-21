export type PalleteEntry = {
  widgetLabel: string;
  componentName: string;
  category: string;
};

export type Widget = {
  id: string;
  componentName: string;
  category: string;
  pvValue?: string; // Optional for widgets that don't use PVs
  properties: Record<string, any>;
};
