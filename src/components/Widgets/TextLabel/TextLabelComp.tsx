import { useState, useEffect, useRef } from "react";
import type { WidgetUpdate } from "../../../types/widgets";
import { useEditorContext } from "../../Utils/useEditorContext";
import { mapVAlign, mapHAlign } from "../../../shared/helpers";
import { EDIT_MODE } from "../../../shared/constants";

const TextLabelComp: React.FC<WidgetUpdate> = ({ data }) => {
  const { mode, updateWidgetProperty } = useEditorContext();
  const p = data.editableProperties;

  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  if (!p.visible?.value) return null;

  const isEditMode = mode === EDIT_MODE;
  const showEditableInput = isEditMode && editing;

  return (
    <input
      className="textLabelInput"
      ref={inputRef}
      title={p.tooltip?.value ?? ""}
      value={p.label?.value}
      readOnly={!showEditableInput}
      onDoubleClick={() => {
        if (isEditMode) setEditing(true);
      }}
      onBlur={() => setEditing(false)}
      onChange={(e) => updateWidgetProperty(data.id, "label", e.target.value)}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        boxSizing: "border-box",
        justifyContent: mapHAlign(p.textHAlign?.value),
        alignItems: mapVAlign(p.textVAlign?.value),
        pointerEvents: isEditMode ? "auto" : "none",
        zIndex: p.zIndex?.value,
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
        padding: 0,
      }}
    />
  );
};

export { TextLabelComp };
