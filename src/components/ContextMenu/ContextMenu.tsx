import * as React from "react";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import { useEditorContext } from "../Utils/useEditorContext";
import {
  ContentCopy,
  ContentCut,
  ContentPaste,
  KeyboardArrowUp,
  KeyboardDoubleArrowUp,
  KeyboardArrowDown,
  KeyboardDoubleArrowDown,
} from "@mui/icons-material";
import { EDIT_MODE, GRID_ID, MAX_WIDGET_ZINDEX, MIN_WIDGET_ZINDEX } from "../../shared/constants";

export interface ContextMenuProps {
  widgetID: string;
  x: number;
  y: number;
  visible: boolean;
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ widgetID, x, y, visible, onClose }) => {
  const { mode, editorWidgets, updateWidgetProperties } = useEditorContext();
  if (!visible) return null;
  if (mode !== EDIT_MODE) return null; // TODO: create context menu for RUNTIME
  const isGrid = widgetID == GRID_ID;
  const increaseZIndex = (id: string) => {
    const w = editorWidgets.find((w) => w.id === id);
    if (!w?.editableProperties.zIndex) return;
    const currentZIndex = w.editableProperties.zIndex.value;
    if (currentZIndex < MAX_WIDGET_ZINDEX) updateWidgetProperties(id, { zIndex: currentZIndex + 1 });
  };

  const decreaseZIndex = (id: string) => {
    const w = editorWidgets.find((w) => w.id === id);
    if (!w?.editableProperties.zIndex) return;
    const currentZIndex = w.editableProperties.zIndex.value;
    if (currentZIndex > MIN_WIDGET_ZINDEX) updateWidgetProperties(id, { zIndex: currentZIndex - 1 });
  };

  const setMaxZIndex = (id: string) => {
    updateWidgetProperties(id, { zIndex: MAX_WIDGET_ZINDEX });
  };

  const setMinZIndex = (id: string) => {
    updateWidgetProperties(id, { zIndex: MIN_WIDGET_ZINDEX });
  };

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
      action: () => console.log("Copy"),
      disabled: isGrid,
    },
    {
      label: "Paste",
      icon: <ContentPaste fontSize="small" />,
      shortcut: "Ctrl+V",
      action: () => console.log("Paste"),
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
      label: "Send to front",
      icon: <KeyboardDoubleArrowUp fontSize="small" />,
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
      icon: <KeyboardDoubleArrowDown fontSize="small" />,
      shortcut: "",
      action: () => setMinZIndex(widgetID),
      disabled: isGrid,
    },
  ];
  return (
    <Paper
      sx={{
        position: "fixed",
        top: y,
        left: x,
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
