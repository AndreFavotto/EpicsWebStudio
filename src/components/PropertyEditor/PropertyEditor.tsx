import React, { useEffect, useMemo, useState } from "react";
import { styled, type Theme, type CSSObject } from "@mui/material/styles";
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
import type {
  WidgetProperties,
  PropertyValue,
  PropertyKey,
  WidgetProperty,
  MultiWidgetPropertyUpdates,
} from "../../types/widgets";
import { PROPERTY_EDITOR_WIDTH, EDIT_MODE } from "../../constants/constants";
import TextFieldProperty from "./TextFieldProperty";
import BooleanProperty from "./BooleanProperty";
import ColorProperty from "./ColorProperty";
import SelectProperty from "./SelectProperty";
import { CATEGORY_DISPLAY_ORDER } from "../../types/widgetProperties";

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
  if (!properties) return groups;

  const presentCategories = new Set(Object.values(properties).map((prop) => prop.category));
  CATEGORY_DISPLAY_ORDER.filter((cat) => presentCategories.has(cat)).forEach((cat) => {
    groups[cat] = {};
  });
  // Add any other categories not in CATEGORY_DISPLAY_ORDER
  Array.from(presentCategories)
    .filter((cat) => !CATEGORY_DISPLAY_ORDER.includes(cat))
    .forEach((cat) => {
      groups[cat] = {};
    });

  for (const [propName, prop] of Object.entries(properties)) {
    const category = prop.category ?? "Other";
    groups[category][propName] = prop;
  }

  return groups;
};

const PropertyEditor: React.FC = () => {
  const { mode, selectedWidgetIDs, editingWidgets, batchWidgetUpdate, setPropertyEditorFocused, maxWdgZIndex } =
    useEditorContext();
  const isOnlyGridSelected = selectedWidgetIDs.length === 0;
  const singleWidget = editingWidgets.length === 1;
  const [open, setOpen] = useState(false);
  const [manuallyOpened, setManuallyOpened] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const properties: WidgetProperties = useMemo(() => {
    if (editingWidgets.length === 0) return {};
    if (singleWidget) {
      return editingWidgets[0].editableProperties;
    }
    // Get only common properties
    const common: WidgetProperties = { ...editingWidgets[0].editableProperties };
    for (let i = 1; i < editingWidgets.length; i++) {
      const currentProps = editingWidgets[i].editableProperties;
      for (const key of Object.keys(common)) {
        const propName = key as PropertyKey;
        if (!(currentProps[propName] as WidgetProperty)) delete common[propName];
      }
    }

    return common;
  }, [editingWidgets, singleWidget]);

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

  const toggleGroup = (category: string) => {
    setCollapsedGroups((prev) => {
      const current = prev[category] ?? true;
      return { ...prev, [category]: !current };
    });
  };

  const header = singleWidget ? `${editingWidgets[0].widgetLabel} properties` : "Common properties in selection";
  const groupedProperties = getGroupedProperties(properties);

  const handlePropChange = (propName: PropertyKey, newValue: PropertyValue) => {
    const updates: MultiWidgetPropertyUpdates = {};
    editingWidgets.forEach((w) => {
      updates[w.id] = { [propName]: newValue };
    });
    batchWidgetUpdate(updates);
  };

  const renderGroupedPropertyFields = () =>
    Object.entries(groupedProperties).map(([category, props]) => {
      const collapsed = collapsedGroups[category] ?? true;
      return (
        <React.Fragment key={category}>
          <Divider />
          <ListSubheader
            onClick={() => toggleGroup(category)}
            sx={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              userSelect: "none",
            }}
          >
            <IconButton
              size="small"
              sx={{
                transform: collapsed ? "rotate(0deg)" : "rotate(90deg)",
                transition: "transform 0.2s",
                mr: 1,
              }}
            >
              <ChevronRightIcon fontSize="inherit" />
            </IconButton>
            {category}
          </ListSubheader>
          {!collapsed &&
            Object.entries(props).map(([propName, prop]) => {
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
      );
    });
  if (mode !== EDIT_MODE) return null;
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
        sx={{ zIndex: maxWdgZIndex + 1 }}
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
