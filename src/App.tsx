import React, { useState } from "react";
import "./App.css";
import GridZone from "./components/GridZone/GridZone";
import SideBar from "./components/SideBar/SideBar"
import type { Widget } from "./types/widgets"

const App: React.FC = () => {
  const [Widgets, setWidgets] = useState<Widget[]>([]);

  const handleDropWidget = (widget: Widget) => {
    setWidgets((prev) => [...prev, widget]);
  };

  const openPreview = () => {
    localStorage.setItem("previewLayout", JSON.stringify(Widgets));
    window.open("/preview", "_blank");
  };

  return (
    <div className="app">
      {/* <button onClick={openPreview} className="preview-button">
        Preview Runtime (new tab)
      </button> */}
      <div className="sideBar">
        <SideBar></SideBar>
      </div>
      <div className="designer-area">
        <h3>Designer</h3>
        <GridZone dropped={Widgets} onDropWidget={handleDropWidget} />
      </div>
    </div>
  );
};

export default App;
