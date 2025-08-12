import * as React from "react";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import { useEditorContext } from "../../context/useEditorContext";
import {
  ContentCopy,
  ContentCut,
  ContentPaste,
  KeyboardArrowUp,
  KeyboardArrowDown,
  FlipToFront,
  FlipToBack,
} from "@mui/icons-material";
import { EDIT_MODE, GRID_ID, MAX_WIDGET_ZINDEX } from "../../constants/constants";
import type { GridPosition } from "../../types/widgets";

export interface ContextMenuProps {
  widgetID: string;
  pos: GridPosition;
  mousePos: GridPosition;
  visible: boolean;
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ widgetID, pos, mousePos, visible, onClose }) => {
  const { mode, setMaxZIndex, setMinZIndex, increaseZIndex, decreaseZIndex, copyWidget, pasteWidget } =
    useEditorContext();
  if (!visible) return null;
  if (mode !== EDIT_MODE) return null; // TODO: create context menu for RUNTIME
  const isGrid = widgetID == GRID_ID || widgetID == "gridZone";
  const options = [
    {
      label: "Cut",
      icon: <ContentCut fontSize="small" />,
      shortcut: "Ctrl+X",
      action: () => console.log("Cut"),
      disabled: isGrid,
    },
    {
      label: "Copy",
      icon: <ContentCopy fontSize="small" />,
      shortcut: "Ctrl+C",
      action: () => copyWidget(widgetID),
      disabled: isGrid,
    },
    {
      label: "Paste",
      icon: <ContentPaste fontSize="small" />,
      shortcut: "Ctrl+V",
      action: () => pasteWidget(mousePos),
      disabled: false,
    },
    {
      label: "Step forward",
      icon: <KeyboardArrowUp fontSize="small" />,
      shortcut: "",
      action: () => increaseZIndex(widgetID),
      disabled: isGrid,
    },
    {
      label: "Bring to front",
      icon: <FlipToFront fontSize="small" />,
      shortcut: "",
      action: () => setMaxZIndex(widgetID),
      disabled: isGrid,
    },
    {
      label: "Step back",
      icon: <KeyboardArrowDown fontSize="small" />,
      shortcut: "",
      action: () => decreaseZIndex(widgetID),
      disabled: isGrid,
    },
    {
      label: "Send to back",
      icon: <FlipToBack fontSize="small" />,
      shortcut: "",
      action: () => setMinZIndex(widgetID),
      disabled: isGrid,
    },
  ];
  return (
    <Paper
      sx={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        zIndex: MAX_WIDGET_ZINDEX + 1,
        width: 220,
        maxWidth: "100%",
        boxShadow: 3,
      }}
    >
      <MenuList dense>
        {options.map((opt, index) => (
          <MenuItem
            key={index}
            disabled={opt.disabled}
            onClick={(e) => {
              e.stopPropagation();
              opt.action();
              onClose();
            }}
          >
            {opt.icon && <ListItemIcon>{opt.icon}</ListItemIcon>}
            <ListItemText>{opt.label}</ListItemText>
            {opt.shortcut && (
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {opt.shortcut}
              </Typography>
            )}
          </MenuItem>
        ))}
      </MenuList>
    </Paper>
  );
};

export default ContextMenu;
