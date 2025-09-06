// src/components/PropertyFields/PvListProperty.tsx
import React from "react";
import ListItem from "@mui/material/ListItem";
import TextField from "@mui/material/TextField";
import type { PropertyKey, PropertyValue } from "../../types/widgets";

interface PvListPropertyProps {
  propName: PropertyKey;
  label: string;
  value: PropertyValue;
  onChange: (propName: PropertyKey, newValue: PropertyValue) => void;
}

const PvListProperty: React.FC<PvListPropertyProps> = ({ propName, label, value, onChange }) => {
  if (typeof value !== "object" || value === null) {
    console.warn(`PvListProperty expected Record<string,string>, got`, value);
    return null;
  }
  const handleChange = (key: string, newVal: string) => {
    onChange(propName, { ...value, [key]: newVal });
  };

  return (
    <>
      {Object.entries(value).map(([key, val]) => (
        <ListItem key={key} disablePadding sx={{ px: 2, py: 1 }} title={label}>
          <TextField
            fullWidth
            size="small"
            label={key}
            value={val}
            onChange={(e) => handleChange(key, e.target.value)}
          />
        </ListItem>
      ))}
    </>
  );
};

export default React.memo(PvListProperty);
