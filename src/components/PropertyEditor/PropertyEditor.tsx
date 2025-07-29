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
  TextField,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useEditorContext } from "../Utils/useEditorContext";
import type { WidgetProperties, PropertyValue, PropertyKey } from "../../types/widgets";
import { PROPERTY_EDITOR_WIDTH, EDIT_MODE } from "../../shared/constants";

const openedMixin = (theme: Theme): CSSObject => ({
  width: PROPERTY_EDITOR_WIDTH,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  width: 0, // no space taken when collapsed
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
  top: (theme.mixins.toolbar.minHeight as number) + 16, // moved further down
  right: open ? PROPERTY_EDITOR_WIDTH + 8 : 8,
  zIndex: theme.zIndex.drawer + 2,
  background: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  "&:hover": {
    background: theme.palette.background.default,
  },
}));

const PropertyEditor: React.FC = () => {
  const { mode, selectedWidgetIDs, editorWidgets, updateWidgetProperty, setPropertyEditorFocused } = useEditorContext();

  const GridWidget = editorWidgets[0];

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

  const header = `Edit ${editingWidget.widgetLabel}`;
  const properties = editingWidget.editableProperties;

  const onChange = (propName: PropertyKey, newValue: PropertyValue) => {
    updateWidgetProperty(editingWidget.id, propName, newValue);
  };

  const renderPropertyFields = (
    props: WidgetProperties,
    onChange: (propName: PropertyKey, newVal: PropertyValue) => void
  ) => {
    return Object.entries(props).map(([propName, prop]) => {
      const { selType, label, value } = prop;

      const FieldWrapper: React.FC<{
        render: (val: PropertyValue, setVal: (v: PropertyValue) => void) => React.JSX.Element;
        initial: PropertyValue;
      }> = ({ render, initial }) => {
        const [localVal, setLocalVal] = useState<PropertyValue>(initial);
        return render(localVal, setLocalVal);
      };

      switch (selType) {
        case "text":
        case "number":
          return (
            <ListItem key={propName} disablePadding sx={{ px: 2, py: 1 }}>
              <FieldWrapper
                initial={value}
                render={(localVal, setLocalVal) => (
                  <TextField
                    fullWidth
                    label={label}
                    variant="outlined"
                    size="small"
                    type={selType}
                    value={localVal}
                    onChange={(e) => setLocalVal(selType === "number" ? Number(e.target.value) : e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.currentTarget.blur();
                        e.preventDefault();
                      }
                    }}
                    onBlur={() => {
                      if (localVal !== value) onChange(propName as PropertyKey, localVal);
                    }}
                  />
                )}
              />
            </ListItem>
          );

        case "boolean":
          return (
            <ListItem key={propName} disablePadding sx={{ px: 2, py: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox checked={!!value} onChange={(e) => onChange(propName as PropertyKey, e.target.checked)} />
                }
                label={label}
              />
            </ListItem>
          );

        case "colorSelector":
          return (
            <ListItem key={propName} disablePadding sx={{ px: 2, py: 1 }}>
              <FieldWrapper
                initial={value}
                render={(localVal, setLocalVal) => (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}>
                    <Typography variant="body2">{label}</Typography>
                    <input
                      type="color"
                      value={value as string}
                      onChange={(e) => setLocalVal(e.target.value)}
                      onBlur={() => {
                        if (localVal !== value) onChange(propName as PropertyKey, localVal);
                      }}
                    />
                  </Box>
                )}
              />
            </ListItem>
          );

        default:
          return null;
      }
    });
  };
  if (mode !== EDIT_MODE) return;
  return (
    <>
      {/* Floating toggle button only when collapsed */}
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
        PaperProps={{
          elevation: 8,
        }}
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
          <Divider />
          {renderPropertyFields(properties, onChange)}
        </List>
      </Drawer>
    </>
  );
};

export default PropertyEditor;
