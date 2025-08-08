import React from "react";
import { useEditorContext } from "../../context/useEditorContext";
import { IconButton, Tooltip, Box } from "@mui/material";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import AlignVerticalTopIcon from "@mui/icons-material/AlignVerticalTop";
import AlignVerticalBottomIcon from "@mui/icons-material/AlignVerticalBottom";
import AlignHorizontalLeftIcon from "@mui/icons-material/AlignHorizontalLeft";
import AlignHorizontalRightIcon from "@mui/icons-material/AlignHorizontalRight";
import FlipToFrontIcon from "@mui/icons-material/FlipToFront";
import FlipToBackIcon from "@mui/icons-material/FlipToBack";
import AlignVerticalCenterIcon from "@mui/icons-material/AlignVerticalCenter";
import AlignHorizontalCenterIcon from "@mui/icons-material/AlignHorizontalCenter";

const ToolbarButtons: React.FC = () => {
  const {
    selectedWidgetIDs,
    handleUndo,
    undoStack,
    handleRedo,
    redoStack,
    setMaxZIndex,
    setMinZIndex,
    //align widget methods
  } = useEditorContext();
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <Tooltip title="Undo">
        <IconButton size="small" onClick={handleUndo} disabled={undoStack.length == 0}>
          <UndoIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Redo">
        <IconButton size="small" onClick={handleRedo} disabled={redoStack.length == 0}>
          <RedoIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Bring to Front">
        <IconButton size="small" onClick={() => setMaxZIndex(selectedWidgetIDs[0])}>
          <FlipToFrontIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Bring to Back">
        <IconButton size="small" onClick={() => setMinZIndex(selectedWidgetIDs[0])}>
          <FlipToBackIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Align Left">
        <IconButton size="small" onClick={() => console.log("align left")}>
          <AlignHorizontalLeftIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Align Right">
        <IconButton size="small" onClick={() => console.log("align right")}>
          <AlignHorizontalRightIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Align Top">
        <IconButton size="small" onClick={() => console.log("align top")}>
          <AlignVerticalTopIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Align Bottom">
        <IconButton size="small" onClick={() => console.log("align bottom")}>
          <AlignVerticalBottomIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Align Vertical Center">
        <IconButton size="small" onClick={() => console.log("align v center")}>
          <AlignVerticalCenterIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Align Horizontal Center">
        <IconButton size="small" onClick={() => console.log("align h center")}>
          <AlignHorizontalCenterIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ToolbarButtons;
