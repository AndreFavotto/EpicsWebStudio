import React from "react";
import type { Widget } from "../../types/widgets";
import WidgetRegistry from "../../Utils/WidgetRegistry";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import WidgetsIcon from "@mui/icons-material/Widgets";
import Toolbar from "@mui/material/Toolbar";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

interface DraggableItemProps {
  item: Widget;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ item }) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("application/json", JSON.stringify(item));
  };

  return (
    <ListItem disablePadding>
      <ListItemButton draggable onDragStart={handleDragStart}>
        <ListItemIcon>
          <WidgetsIcon />
        </ListItemIcon>
        <ListItemText primary={item.widgetLabel} />
      </ListItemButton>
    </ListItem>
  );
};

const WidgetSelector: React.FC = () => {
  // Convert WidgetRegistry to a Record<string, Widget>
  const palette: Record<string, Widget> = Object.fromEntries(
    Object.values(WidgetRegistry).map((w) => [w.componentName, w])
  ) as Record<string, Widget>;

  // Group by category
  const categories = React.useMemo(() => {
    const grouped: Record<string, Widget[]> = {};
    for (const entry of Object.values(palette)) {
      const category = entry.category || "Uncategorized";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(entry);
    }
    return grouped;
  }, [palette]);

  const [openCategories, setOpenCategories] = React.useState<Record<string, boolean>>({});

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: "15rem",
        [`& .MuiDrawer-paper`]: {
          width: "15rem",
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />
      <List>
        {Object.entries(categories).map(([category, items]) => (
          <React.Fragment key={category}>
            <ListItemButton onClick={() => toggleCategory(category)}>
              <ListItemText primary={category} />
              {openCategories[category] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openCategories[category]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {items.map((item) => (
                  <DraggableItem key={item.componentName} item={item} />
                ))}
              </List>
            </Collapse>
          </React.Fragment>
        ))}
      </List>
      <Divider />
    </Drawer>
  );
};

export default WidgetSelector;
