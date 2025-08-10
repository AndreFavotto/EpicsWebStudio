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
    alignTop,
    alignBottom,
    alignHorizontalCenter,
    alignLeft,
    alignRight,
    alignVerticalCenter,
    //align widget methods
  } = useEditorContext();
  const noneSelected = selectedWidgetIDs.length == 0;
  const lessThanTwoSelected = selectedWidgetIDs.length < 2;
  // const lessThanThreeSelected = selectedWidgetIDs.length < 3;
  const nothingToRedo = redoStack.length == 0;
  const nothingToUndo = undoStack.length == 0;
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <Tooltip title="Undo">
        <IconButton size="small" onClick={handleUndo} disabled={nothingToUndo}>
          <UndoIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Redo">
        <IconButton size="small" onClick={handleRedo} disabled={nothingToRedo}>
          <RedoIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Bring to Front">
        <IconButton size="small" onClick={() => setMaxZIndex()} disabled={noneSelected}>
          <FlipToFrontIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Bring to Back">
        <IconButton size="small" onClick={() => setMinZIndex()} disabled={noneSelected}>
          <FlipToBackIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Align Left">
        <IconButton size="small" onClick={() => alignLeft()} disabled={lessThanTwoSelected}>
          <AlignHorizontalLeftIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Align Right">
        <IconButton size="small" onClick={() => alignRight()} disabled={lessThanTwoSelected}>
          <AlignHorizontalRightIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Align Top">
        <IconButton size="small" onClick={() => alignTop()} disabled={lessThanTwoSelected}>
          <AlignVerticalTopIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Align Bottom">
        <IconButton size="small" onClick={() => alignBottom()} disabled={lessThanTwoSelected}>
          <AlignVerticalBottomIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Align Vertical Center">
        <IconButton size="small" onClick={() => alignVerticalCenter()} disabled={lessThanTwoSelected}>
          <AlignVerticalCenterIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Align Horizontal Center">
        <IconButton size="small" onClick={() => alignHorizontalCenter()} disabled={lessThanTwoSelected}>
          <AlignHorizontalCenterIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ToolbarButtons;
