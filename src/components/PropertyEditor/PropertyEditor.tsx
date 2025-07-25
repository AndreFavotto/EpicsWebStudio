import React, { useState } from "react";
import { useEditorContext } from "../Utils/EditorContext";
import type { WidgetProperties, PropertyValue, PropertyKey } from "../../types/widgets";
import {
  TextField,
  List,
  Divider,
  ListItem,
  ListItemText,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
  Drawer,
  Toolbar,
} from "@mui/material";

const PropertyEditor: React.FC = () => {
  const { selectedWidgetIDs, editorWidgets, updateWidgetProperty, setPropertyEditorFocused } = useEditorContext();
  // show the first selected widget or the grid properties
  const GridWidget = editorWidgets[0];
  let editingWidget;
  if (selectedWidgetIDs.length > 0) {
    editingWidget = editorWidgets.find((w) => w.id === selectedWidgetIDs[0]) ?? GridWidget;
  } else {
    editingWidget = GridWidget;
  }

  const renderPropertyFields = (
    properties: WidgetProperties,
    onChange: (propName: PropertyKey, newVal: PropertyValue) => void
  ) => {
    return Object.entries(properties).map(([propName, prop]) => {
      const { selType, label, value } = prop;

      const FieldWrapper: React.FC<{
        render: (val: PropertyValue, setVal: (v: PropertyValue) => void) => React.JSX.Element;
        initial: PropertyValue;
      }> = (props) => {
        const { render, initial } = props;
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
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      width: "100%",
                    }}
                  >
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

        // case "select":
        default:
          return null;
      }
    });
  };

  const header = `Edit ${editingWidget.componentName}`;

  const properties = editingWidget.editableProperties;

  const onChange = (propName: PropertyKey, newValue: PropertyValue) => {
    updateWidgetProperty(editingWidget.id, propName, newValue);
  };

  return (
    <Drawer
      onFocus={() => setPropertyEditorFocused(true)}
      onBlur={() => setPropertyEditorFocused(false)}
      variant="permanent"
      anchor="right"
      sx={{
        width: "20rem",
        [`& .MuiDrawer-paper`]: {
          width: "20rem",
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />
      <List>
        <ListItem>
          <ListItemText primary={header} />
        </ListItem>
        <Divider />
        {renderPropertyFields(properties, onChange)}
      </List>
    </Drawer>
  );
};

export default PropertyEditor;
