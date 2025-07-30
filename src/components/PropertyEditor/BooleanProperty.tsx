// src/components/PropertyFields/BooleanProperty.tsx
import React from "react";
import { FormControlLabel, Checkbox, ListItem } from "@mui/material";
import type { PropertyKey, PropertyValue } from "../../types/widgets"; // Adjust path as needed

interface BooleanPropertyProps {
  propName: PropertyKey;
  label: string;
  value: PropertyValue;
  onChange: (propName: PropertyKey, newValue: PropertyValue) => void;
}

const BooleanProperty: React.FC<BooleanPropertyProps> = ({ propName, label, value, onChange }) => {
  return (
    <ListItem key={propName} disablePadding sx={{ px: 2, py: 1 }}>
      <FormControlLabel
        control={<Checkbox checked={!!value} onChange={(e) => onChange(propName, e.target.checked)} />}
        label={label}
      />
    </ListItem>
  );
};

export default React.memo(BooleanProperty); // Memoize for performance
