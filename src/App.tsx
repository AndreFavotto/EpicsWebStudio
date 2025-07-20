import React from "react";
import "./App.css";
import { GridZone } from "./components/GridZone/GridZone";
import SideBar from "./components/SideBar/SideBar"
import { EditorProvider } from "./components/Utils/EditorContext";
import PropertyEditor from "./components/PropertyEditor/PropertyEditor";

const App: React.FC = () => {
  return (
    <EditorProvider>
      <div className="app">
        {/* <button onClick={openPreview} className="preview-button">
          Preview Runtime (new tab)
        </button> */}
        <div className="sideBar">
          <SideBar/>
        </div>
        <div className="propEditor">
          <PropertyEditor/>
        </div>
        <div className="designer-area">
          <h3>Designer</h3>
          <GridZone/>
        </div>
      </div>
    </EditorProvider>
  );
};

export default App;
