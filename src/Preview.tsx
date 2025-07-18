import React, { useEffect, useState } from "react";
import Renderer from "./Renderer";
import type { Widget } from "./types/widgets";

const Preview: React.FC = () => {
  const [layout, setLayout] = useState<Widget[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("previewLayout");
    if (data) {
      try {
        setLayout(JSON.parse(data));
      } catch {
        setLayout([]);
      }
    }
  }, []);

  if (layout.length === 0) {
    return <div>No layout found in localStorage.</div>;
  }

  return <Renderer layout={layout} />;
};

export default Preview;
