import React, { useState, useEffect } from "react";
import { Box, Typography, ListItem } from "@mui/material";
import type { PropertyKey, PropertyValue } from "../../types/widgets";

interface ColorPropertyProps {
  propName: PropertyKey;
  label: string;
  value: PropertyValue;
  onChange: (propName: PropertyKey, newValue: PropertyValue) => void;
}

const ColorProperty: React.FC<ColorPropertyProps> = (props) => {
  const { propName, label, value, onChange } = props;
  const [localVal, setLocalVal] = useState(value as string);

  useEffect(() => {
    setLocalVal(value as string);
  }, [value]);

  const handleBlur = () => {
    if (localVal !== value) {
      onChange(propName, localVal);
    }
  };

  return (
    <ListItem key={propName} disablePadding sx={{ px: 2, py: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}>
        <Typography variant="body2">{label}</Typography>
        <input type="color" value={localVal} onChange={(e) => setLocalVal(e.target.value)} onBlur={handleBlur} />
      </Box>
    </ListItem>
  );
};

export default React.memo(ColorProperty);
