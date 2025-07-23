import React, { useState, useEffect } from "react";
import { useEditorContext } from "../Utils/EditorContext";
import { widgetRegistry } from "../Utils/WidgetRegistry";
import { gridMetadata } from "../GridZone/GridZone";
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
  const { selectedWidgets, updateWidgetProperty, gridProps, updateGridProps, setPropertyEditorFocused } =
    useEditorContext();
  const editingWidget = selectedWidgets[0];
  const renderPropertyFields = (
    obj: Record<string, any>,
    propsMeta: Record<string, any>,
    onChange: (key: string, value: any) => void
  ) => {
    return Object.entries(propsMeta).map(([key, meta]) => {
      const value = obj[key] ?? "";
      const label = meta.label;
      const type = meta.selType;

      const FieldWrapper: React.FC<{
        render: (val: any, setVal: (v: any) => void) => React.JSX.Element;
        initial: any;
      }> = ({ render, initial }) => {
        const [localVal, setLocalVal] = useState(initial);

        const commit = () => {
          if (localVal !== initial) onChange(key, localVal);
        };

        return render(localVal, setLocalVal);
      };

      switch (type) {
        case "string":
        case "number":
        case "any":
          return (
            <ListItem key={key} disablePadding sx={{ px: 2, py: 1 }}>
              <FieldWrapper
                initial={value}
                render={(localVal, setLocalVal) => (
                  <TextField
                    fullWidth
                    label={label}
                    variant="outlined"
                    size="small"
                    type={type === "number" ? "number" : "text"}
                    value={localVal}
                    onChange={(e) => setLocalVal(type === "number" ? Number(e.target.value) : e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.currentTarget.blur();
                      }
                    }}
                    onBlur={() => {
                      if (localVal !== value) onChange(key, localVal);
                    }}
                  />
                )}
              />
            </ListItem>
          );

        case "boolean":
          return (
            <ListItem key={key} disablePadding sx={{ px: 2, py: 1 }}>
              <FormControlLabel
                control={<Checkbox checked={!!value} onChange={(e) => onChange(key, e.target.checked)} />}
                label={label}
              />
            </ListItem>
          );

        case "colorSelector":
          return (
            <ListItem key={key} disablePadding sx={{ px: 2, py: 1 }}>
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
                      value={localVal}
                      onChange={(e) => setLocalVal(e.target.value)}
                      onBlur={() => {
                        if (localVal !== value) onChange(key, localVal);
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

  const header = editingWidget ? `Edit: ${editingWidget.properties.label}` : "Edit Grid";

  const propsMeta = editingWidget ? widgetRegistry[editingWidget.componentName].properties : gridMetadata.properties;

  const propsValues = editingWidget ? editingWidget.properties : gridProps;

  const onChange = (key: string, value: any) => {
    if (editingWidget) {
      updateWidgetProperty(editingWidget.id, key, value);
    } else {
      updateGridProps({ ...gridProps, [key]: value });
    }
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
        {renderPropertyFields(propsValues, propsMeta, onChange)}
      </List>
    </Drawer>
  );
};

export default PropertyEditor;
