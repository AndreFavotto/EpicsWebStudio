import React, { useState } from "react";
import type { WidgetUpdate } from "../../../types/widgets";
import { useEditorContext } from "../../../context/useEditorContext";
import { EDIT_MODE, RUNTIME_MODE } from "../../../constants/constants";
import AlarmBorder from "../../AlarmBorder/AlarmBorder";

const InputFieldComp: React.FC<WidgetUpdate> = ({ data }) => {
  const { mode, writePVValue } = useEditorContext();
  const [inputValue, setInputValue] = useState("");
  const p = data.editableProperties;
  const pvData = data.pvData;

  if (!p.visible?.value) return null;
  const isEditMode = mode === EDIT_MODE;
  const handleWrite = (value: number | string) => {
    if (mode !== RUNTIME_MODE) return;
    if (p.pvName?.value) {
      writePVValue(p.pvName.value, value);
    }
  };

  return (
    <AlarmBorder alarmData={pvData?.alarm} enable={p.alarmBorder?.value}>
      <input
        title={p.tooltip?.value ?? ""}
        readOnly={isEditMode}
        style={{
          width: "100%",
          height: "100%",
          margin: "auto",
          backgroundColor: p.backgroundColor?.value,
          fontSize: p.fontSize?.value,
          fontFamily: p.fontFamily?.value,
          fontWeight: p.fontBold?.value ? "bold" : "normal",
          fontStyle: p.fontItalic?.value ? "italic" : "normal",
          color: p.textColor?.value,
          borderRadius: p.borderRadius?.value,
          borderStyle: p.borderStyle?.value,
          borderWidth: p.borderWidth?.value,
          borderColor: p.borderColor?.value,
          boxSizing: "border-box",
          padding: "4px 8px",
          pointerEvents: isEditMode ? "none" : "auto",
        }}
        disabled={p.disabled?.value}
        placeholder={p.pvName?.value ?? p.label?.value}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleWrite(inputValue);
          }
        }}
      />
    </AlarmBorder>
  );
};

export { InputFieldComp };
