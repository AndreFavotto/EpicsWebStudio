import React from "react";
import type { Widget } from "../../../types/widgets";

const meta = {
  label: "Text Input",
  componentName: "TextInputWidget",
  defaultWidth: 100,
  defaultHeight: 40,
};

type Props = {
  widget: Widget;
  // Optional callbacks for builder mode (drag/resize handlers, click, etc)
  onClick?: () => void;
};

const TextInputWidget: React.FC<Props> = ({ widget }) => {
    return (
    <><div
        style={{
        width: "100%",      // fill parent controlled by Rnd
        height: "100%",     // fill parent controlled by Rnd
        userSelect: "none",
        borderRadius: 4,
        fontSize: 14,
        backgroundColor: "#9c9fa3ff",
        color: "white",
        border: "none",
      }}>
        {widget.label}
      </div>
    </>
  );
};

export { meta as textInputMetadata };
export { TextInputWidget };