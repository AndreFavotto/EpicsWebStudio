import React from "react";
import { Button } from "@mui/material";
import { useEditorContext } from "../../Utils/EditorContext";
import type { WidgetUpdate } from "../../../types/widgets";
import * as CONSTS from "../../../shared/constants";

const ActionButtonComp: React.FC<WidgetUpdate> = ({ data }) => {
  const { mode, writePVValue } = useEditorContext();
  const { disabled, tooltip, textColor, borderRadius, pvName, label, backgroundColor, actionValue } =
    data.editableProperties;

  const handleClick = (_e: React.MouseEvent) => {
    if (mode === CONSTS.RUNTIME_MODE) {
      if (pvName?.value && actionValue?.value) {
        writePVValue(pvName.value, actionValue.value);
      }
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
      onClick={(e) => handleClick(e)}
    >
      {label!.value}
    </Button>
  );
};

export { ActionButtonComp };
