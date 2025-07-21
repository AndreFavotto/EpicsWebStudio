import React from "react";
import "./App.css";
import { GridZone } from "./components/GridZone/GridZone";
import WidgetSelector from "./components/WidgetSelector/WidgetSelector"
import { EditorProvider } from "./components/Utils/EditorContext";
import PropertyEditor from "./components/PropertyEditor/PropertyEditor";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import * as CONSTS from "./shared/constants";

const App: React.FC = () => {
  return (
      <EditorProvider>
      <div className="app">
        <AppBar position="fixed" 
            sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, 
                  backgroundColor: CONSTS.DEFAULT_COLORS.titleBarColor,
            }}>
          <Toolbar>
              EPICS Web Suite Designer
          {/* <button onClick={openPreview} className="preview-button">
            Preview Runtime (new tab)
          </button> */}
          </Toolbar>
        </AppBar>
        <div className="designerArea">
          <div className="widgetSelector">
            <WidgetSelector/>
          </div>
          <div className="grid">
            <GridZone/>
          </div>
          <div className="propertyEditor">
            <PropertyEditor/>
          </div>
        </div>
      </div>
    </EditorProvider>
  );
};

export default App;
