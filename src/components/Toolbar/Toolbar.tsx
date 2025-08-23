import React from "react";
import { useEditorContext } from "../../context/useEditorContext";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import AlignVerticalTop from "@mui/icons-material/AlignVerticalTop";
import Undo from "@mui/icons-material/Undo";
import Redo from "@mui/icons-material/Redo";
import AlignVerticalBottom from "@mui/icons-material/AlignVerticalBottom";
import AlignHorizontalLeft from "@mui/icons-material/AlignHorizontalLeft";
import AlignHorizontalRight from "@mui/icons-material/AlignHorizontalRight";
import FlipToFront from "@mui/icons-material/FlipToFront";
import FlipToBack from "@mui/icons-material/FlipToBack";
import AlignVerticalCenter from "@mui/icons-material/AlignVerticalCenter";
import AlignHorizontalCenter from "@mui/icons-material/AlignHorizontalCenter";
import DragIndicator from "@mui/icons-material/DragIndicator";
import { EDIT_MODE } from "../../constants/constants";
import { Rnd } from "react-rnd";
import "./Toolbar.css";

export interface ToolBarProps {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const ToolbarButtons: React.FC<ToolBarProps> = ({ onMouseEnter, onMouseLeave }) => {
  const {
    mode,
    selectedWidgetIDs,
    handleUndo,
    undoStack,
    handleRedo,
    redoStack,
    bringToFront,
    sendToBack,
    alignTop,
    alignBottom,
    alignHorizontalCenter,
    alignLeft,
    alignRight,
    alignVerticalCenter,
  } = useEditorContext();

  if (mode !== EDIT_MODE) return null;

  const noneSelected = selectedWidgetIDs.length === 0;
  const lessThanTwoSelected = selectedWidgetIDs.length < 2;
  const nothingToRedo = redoStack.length === 0;
  const nothingToUndo = undoStack.length === 0;

  return (
    <Rnd
      className="toolBar"
      default={{ x: 80, y: 15, width: 350, height: 40 }}
      bounds="window"
      enableResizing={false}
      dragHandleClassName="dragHandle"
    >
      <Box className="toolbarBox" onMouseEnter={() => onMouseEnter()} onMouseLeave={() => onMouseLeave()}>
        <Box className="dragHandle" sx={{ cursor: "move", px: 1, display: "flex", alignItems: "center" }}>
          <DragIndicator fontSize="small" />
        </Box>

        {/* Buttons */}
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
            <IconButton size="small" onClick={() => bringToFront()} disabled={noneSelected}>
              <FlipToFront fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Send to back">
          <span>
            <IconButton size="small" onClick={() => sendToBack()} disabled={noneSelected}>
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
    </Rnd>
  );
};

export default ToolbarButtons;
