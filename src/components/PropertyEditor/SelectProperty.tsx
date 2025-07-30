// src/components/PropertyFields/SelectProperty.tsx
import React from "react";
import { ListItem, FormControl, InputLabel, Select, MenuItem, type SelectChangeEvent } from "@mui/material";
import type { PropertyKey, PropertyValue } from "../../types/widgets";

interface SelectPropertyProps {
  propName: PropertyKey;
  label: string;
  value: PropertyValue;
  options: string[]; // Could be extended to value-label pairs if needed
  onChange: (propName: PropertyKey, newValue: PropertyValue) => void;
}

const SelectProperty: React.FC<SelectPropertyProps> = ({ propName, label, value, options, onChange }) => {
  const handleChange = (e: SelectChangeEvent) => {
    onChange(propName, e.target.value);
  };

  return (
    <ListItem key={propName} disablePadding sx={{ px: 2, py: 1 }}>
      <FormControl fullWidth size="small">
        <InputLabel>{label}</InputLabel>
        <Select label={label} value={value as string} onChange={handleChange}>
          {options.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </ListItem>
  );
};

export default React.memo(SelectProperty);
