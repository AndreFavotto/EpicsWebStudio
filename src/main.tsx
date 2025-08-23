import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { EditorProvider } from "./context/EditorProvider.tsx";
import App from "./App.tsx";

import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Preview from "./Preview";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <EditorProvider>
        <Routes>
          <Route path="/" element={<App />} />
          {/* <Route path="/preview" element={<Preview />} /> */}
        </Routes>
      </EditorProvider>
    </BrowserRouter>
  </StrictMode>
);
