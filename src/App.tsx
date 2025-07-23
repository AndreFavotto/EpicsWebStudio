import React from "react";
import "./App.css";
import { GridZone } from "./components/GridZone/GridZone";
import WidgetSelector from "./components/WidgetSelector/WidgetSelector";
import { EditorProvider } from "./components/Utils/EditorContext";
import PropertyEditor from "./components/PropertyEditor/PropertyEditor";
import NavBar from "./components/NavBar/NavBar";

const App: React.FC = () => {
  return (
    <EditorProvider>
      <div className="app">
        <div className="appBar">
          <NavBar />
        </div>
        <div className="designerArea">
          <div className="widgetSelector">
            <WidgetSelector />
          </div>
          <div className="grid">
            <GridZone />
          </div>
          <div className="propertyEditor">
            <PropertyEditor />
          </div>
        </div>
      </div>
    </EditorProvider>
  );
};

export default App;
