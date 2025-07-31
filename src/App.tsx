import React, { useMemo } from "react";
import "./App.css";
import { GridZone } from "./components/GridZone/";
import WidgetSelector from "./components/WidgetSelector/WidgetSelector";
import PropertyEditor from "./components/PropertyEditor/PropertyEditor";
import NavBar from "./components/NavBar/NavBar";
import { useEditorContext } from "./components/Utils/useEditorContext";

const App: React.FC = () => {
  const { editorWidgets } = useEditorContext();
  const gridProperties = useMemo(() => editorWidgets.find((w) => w.id === "grid"), [editorWidgets]);
  return (
    <div className="app">
      <div className="appBar">
        <NavBar />
      </div>
      <div className="designerArea">
        <div className="widgetSelector">
          <WidgetSelector />
        </div>
        <div className="grid">
          <GridZone.component data={gridProperties!} />
        </div>
        <div className="propertyEditor">
          <PropertyEditor />
        </div>
      </div>
    </div>
  );
};

export default App;
