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
import { EDIT_MODE } from "../../shared/constants";

const ToolbarButtons: React.FC = () => {
  const {
    mode,
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
  if (mode !== EDIT_MODE) return null;
  const noneSelected = selectedWidgetIDs.length == 0;
  const lessThanTwoSelected = selectedWidgetIDs.length < 2;
  // const lessThanThreeSelected = selectedWidgetIDs.length < 3;
  const nothingToRedo = redoStack.length == 0;
  const nothingToUndo = undoStack.length == 0;
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <Tooltip title="Undo">
        <span>
          <IconButton size="small" onClick={handleUndo} disabled={nothingToUndo}>
            <UndoIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Redo">
        <span>
          <IconButton size="small" onClick={handleRedo} disabled={nothingToRedo}>
            <RedoIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Bring to Front">
        <span>
          <IconButton size="small" onClick={() => setMaxZIndex()} disabled={noneSelected}>
            <FlipToFrontIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Bring to Back">
        <span>
          <IconButton size="small" onClick={() => setMinZIndex()} disabled={noneSelected}>
            <FlipToBackIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Align Left">
        <span>
          <IconButton size="small" onClick={() => alignLeft()} disabled={lessThanTwoSelected}>
            <AlignHorizontalLeftIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Align Right">
        <span>
          <IconButton size="small" onClick={() => alignRight()} disabled={lessThanTwoSelected}>
            <AlignHorizontalRightIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Align Top">
        <span>
          <IconButton size="small" onClick={() => alignTop()} disabled={lessThanTwoSelected}>
            <AlignVerticalTopIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Align Bottom">
        <span>
          <IconButton size="small" onClick={() => alignBottom()} disabled={lessThanTwoSelected}>
            <AlignVerticalBottomIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Align Vertical Center">
        <span>
          <IconButton size="small" onClick={() => alignVerticalCenter()} disabled={lessThanTwoSelected}>
            <AlignVerticalCenterIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Align Horizontal Center">
        <span>
          <IconButton size="small" onClick={() => alignHorizontalCenter()} disabled={lessThanTwoSelected}>
            <AlignHorizontalCenterIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
};

export default ToolbarButtons;
