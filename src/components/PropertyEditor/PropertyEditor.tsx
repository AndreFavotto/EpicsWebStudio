import React from "react";
import "./PropertyEditor.css";
import { useEditorContext } from "../Utils/EditorContext";
import { widgetRegistry } from "../Utils/WidgetRegistry";
import { gridMetadata } from "../GridZone/GridZone";

const PropertyEditor: React.FC = () => {
  const { selectedWidget, updateWidget, gridProps, updateGridProps } = useEditorContext();

  const renderPropertyFields = (
    obj: Record<string, any>,
    propsMeta: Record<string, any>,
    onChange: (key: string, value: any) => void
  ) => {
    return Object.entries(propsMeta).map(([key, meta]) => (
      <div key={key}>
        <label>{meta.label}</label>
        <input
          type="text"
          value={obj[key] ?? ""}
          onChange={(e) => onChange(key, e.target.value)}
        />
      </div>
    ));
  };

  if (!selectedWidget) {
    // Grid is selected
    return (
      <div className="properties-panel">
        <h4>Edit Grid</h4>
        {renderPropertyFields(gridProps, gridMetadata.properties, (key, value) =>
          updateGridProps({ ...gridProps, [key]: value })
        )}
      </div>
    );
  }

  const widgetProps = widgetRegistry[selectedWidget.componentName].properties;

  return (
    <div className="properties-panel">
      <h4>Edit: {selectedWidget.properties.label}</h4>
      {renderPropertyFields(selectedWidget.properties, widgetProps, (key, value) =>
        updateWidget({
          ...selectedWidget,
          properties: {
            ...selectedWidget.properties,
            [key]: value,
          },
        })
      )}
    </div>
  );
};

export default PropertyEditor;
