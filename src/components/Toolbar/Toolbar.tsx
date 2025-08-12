import React from "react";
import { useEditorContext } from "../../context/useEditorContext";
import { IconButton, Tooltip, Box } from "@mui/material";
import {
  AlignVerticalTop,
  Undo,
  Redo,
  AlignVerticalBottom,
  AlignHorizontalLeft,
  AlignHorizontalRight,
  FlipToFront,
  FlipToBack,
  AlignVerticalCenter,
  AlignHorizontalCenter,
} from "@mui/icons-material";

import { EDIT_MODE } from "../../constants/constants";

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
            <Undo fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Redo">
        <span>
          <IconButton size="small" onClick={handleRedo} disabled={nothingToRedo}>
            <Redo fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Bring to front">
        <span>
          <IconButton size="small" onClick={() => setMaxZIndex()} disabled={noneSelected}>
            <FlipToFront fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Send to back">
        <span>
          <IconButton size="small" onClick={() => setMinZIndex()} disabled={noneSelected}>
            <FlipToBack fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Align left">
        <span>
          <IconButton size="small" onClick={() => alignLeft()} disabled={lessThanTwoSelected}>
            <AlignHorizontalLeft fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Align right">
        <span>
          <IconButton size="small" onClick={() => alignRight()} disabled={lessThanTwoSelected}>
            <AlignHorizontalRight fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Align top">
        <span>
          <IconButton size="small" onClick={() => alignTop()} disabled={lessThanTwoSelected}>
            <AlignVerticalTop fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Align bottom">
        <span>
          <IconButton size="small" onClick={() => alignBottom()} disabled={lessThanTwoSelected}>
            <AlignVerticalBottom fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Align vertical center">
        <span>
          <IconButton size="small" onClick={() => alignVerticalCenter()} disabled={lessThanTwoSelected}>
            <AlignVerticalCenter fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Align horizontal center">
        <span>
          <IconButton size="small" onClick={() => alignHorizontalCenter()} disabled={lessThanTwoSelected}>
            <AlignHorizontalCenter fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
};

export default ToolbarButtons;
