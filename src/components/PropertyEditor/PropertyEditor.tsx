import React, { useEffect, useMemo, useState } from "react";
import { styled } from "@mui/material/styles";
import type { Theme, CSSObject } from "@mui/material/styles";
import {
  Drawer as MuiDrawer,
  Toolbar,
  List,
  Divider,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
  ListSubheader,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useEditorContext } from "../../context/useEditorContext";
import type { WidgetProperties, PropertyValue, PropertyKey, WidgetProperty } from "../../types/widgets";
import { PROPERTY_EDITOR_WIDTH, EDIT_MODE, GRID_ID, MAX_WIDGET_ZINDEX } from "../../shared/constants";
import TextFieldProperty from "./TextFieldProperty";
import BooleanProperty from "./BooleanProperty";
import ColorProperty from "./ColorProperty";
import SelectProperty from "./SelectProperty";

const openedMixin = (theme: Theme): CSSObject => ({
  width: PROPERTY_EDITOR_WIDTH,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  width: 0,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open: boolean }>(({ theme, open }) => ({
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  position: "fixed",
  right: 0,
  top: 0,
  height: "100vh",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": {
      ...openedMixin(theme),
      right: 0,
    },
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": {
      ...closedMixin(theme),
      right: 0,
    },
  }),
}));

const ToggleButton = styled(IconButton)<{ open: boolean }>(({ theme, open }) => ({
  position: "fixed",
  top: (theme.mixins.toolbar.minHeight as number) + 16,
  right: open ? PROPERTY_EDITOR_WIDTH + 8 : 8,
  zIndex: theme.zIndex.drawer + 2,
  background: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  "&:hover": {
    background: theme.palette.background.default,
  },
}));

const getGroupedProperties = (properties: WidgetProperties) => {
  const groups: Record<string, Record<string, WidgetProperty>> = {};
  if (properties) {
    for (const [propName, prop] of Object.entries(properties)) {
      const category = prop.category ?? "Other";
      if (!groups[category]) groups[category] = {};
      groups[category][propName] = prop;
    }
  }
  return groups;
};

const PropertyEditor: React.FC = () => {
  const { mode, selectedWidgetIDs, editorWidgets, updateWidgetProperties, setPropertyEditorFocused } =
    useEditorContext();
  const GridWidget = useMemo(() => editorWidgets.find((w) => w.id === GRID_ID), [editorWidgets]);
  const isOnlyGridSelected = selectedWidgetIDs.length === 0;
  const [open, setOpen] = useState(false);
  const [manuallyOpened, setManuallyOpened] = useState(false);

  useEffect(() => {
    if (!isOnlyGridSelected) {
      setOpen(true);
      return;
    }
    if (!manuallyOpened) setOpen(false);
  }, [isOnlyGridSelected, manuallyOpened]);

  const toggleDrawer = () => {
    setOpen((prev) => {
      const next = !prev;
      setManuallyOpened(next);
      return next;
    });
  };

  const editingWidget = useMemo(() => {
    if (!isOnlyGridSelected) {
      return editorWidgets.find((w) => w.id === selectedWidgetIDs[0]) ?? GridWidget;
    }
    return GridWidget;
  }, [editorWidgets, selectedWidgetIDs, isOnlyGridSelected, GridWidget]);

  if (!editingWidget) {
    console.warn("Invalid Grid or Widget ID: editingWidget not found");
    return null;
  }
  if (mode !== EDIT_MODE) return null;

  const header = `Edit ${editingWidget.widgetLabel}`;
  const properties = editingWidget.editableProperties;
  const groupedProperties = getGroupedProperties(properties);

  const handlePropChange = (propName: PropertyKey, newValue: PropertyValue) => {
    updateWidgetProperties(editingWidget.id, { [propName]: newValue });
  };

  const renderGroupedPropertyFields = () =>
    Object.entries(groupedProperties).map(([category, props]) => (
      <React.Fragment key={category}>
        <Divider />
        <ListSubheader>{category}</ListSubheader>
        {Object.entries(props).map(([propName, prop]) => {
          const { selType, label, value, options } = prop;
          const commonProps = {
            propName: propName as PropertyKey,
            label,
            value,
            onChange: handlePropChange,
          };
          switch (selType) {
            case "text":
            case "number":
              return <TextFieldProperty key={propName} {...commonProps} selType={selType} />;
            case "boolean":
              return <BooleanProperty key={propName} {...commonProps} />;
            case "colorSelector":
              return <ColorProperty key={propName} {...commonProps} />;
            case "select":
              return <SelectProperty key={propName} {...commonProps} options={options ?? []} />;
            default:
              return null;
          }
        })}
      </React.Fragment>
    ));

  return (
    <>
      {!open && (
        <Tooltip title="Show properties" placement="left">
          <ToggleButton color="primary" open={open} onClick={toggleDrawer} size="small">
            <ChevronLeftIcon />
          </ToggleButton>
        </Tooltip>
      )}
      <Drawer
        variant="permanent"
        anchor="right"
        open={open}
        onFocus={() => setPropertyEditorFocused(true)}
        onBlur={() => setPropertyEditorFocused(false)}
        slotProps={{ paper: { elevation: 8 } }}
        sx={{ zIndex: MAX_WIDGET_ZINDEX + 1 }}
      >
        <Toolbar />
        <List sx={{ width: "100%" }}>
          <ListItem
            secondaryAction={
              <IconButton edge="end" onClick={toggleDrawer} size="small">
                <ChevronRightIcon />
              </IconButton>
            }
          >
            <ListItemText primary={header} />
          </ListItem>
          {renderGroupedPropertyFields()}
        </List>
      </Drawer>
    </>
  );
};

export default PropertyEditor;
