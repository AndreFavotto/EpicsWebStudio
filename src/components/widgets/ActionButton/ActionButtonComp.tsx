import React from "react";
import { Button } from "@mui/material";
import { useEditorContext } from "../../../Utils/EditorContext";
import type { WidgetUpdate } from "../../../types/widgets";
import * as CONSTS from "../../../shared/constants";

const ActionButtonComp: React.FC<WidgetUpdate> = ({ data }) => {
  const { mode } = useEditorContext();
  const { disabled, tooltip, textColor, borderRadius, pvName, label, backgroundColor, actionValue } = data;

  const handleClick = (e: React.MouseEvent, actionValue: any) => {
    if (mode === CONSTS.RUNTIME_MODE) {
      // Handle action in runtime mode, e.g., send actionValue to a PV or perform an action
      console.log("Button clicked with action value:", actionValue);
    }
  };

  return (
    <Button
      sx={{
        width: "100%",
        height: "100%",
        marginTop: "auto",
        marginBottom: "auto",
        marginLeft: "auto",
        marginRight: "auto",
        backgroundColor: backgroundColor?.value,
        color: textColor?.value,
        borderRadius: borderRadius?.value,
      }}
      disabled={disabled!.value}
      variant="contained"
      onClick={(e) => handleClick(e, actionValue)}
    >
      {label!.value}
    </Button>
  );
};

export { ActionButtonComp };
