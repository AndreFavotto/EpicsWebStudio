import React from "react";
import type { WidgetUpdate } from "../../../types/widgets";
import { FLEX_ALIGN_MAP, RUNTIME_MODE } from "../../../constants/constants";
import { useEditorContext } from "../../../context/useEditorContext";
import AlarmBorder from "../../AlarmBorder/AlarmBorder";
import TextOutput from "ReactAutomationStudio/components/BaseComponents/TextOutput";

const TestRASComp: React.FC<WidgetUpdate> = ({ data }) => {
  const p = data.editableProperties;
  const pvData = data.pvData;
  const { mode } = useEditorContext();

  if (!p.visible?.value) return null;

  const units = p.unitsFromPV?.value ? pvData?.display?.units : p.units?.value;
  const precision = p.precisionFromPV?.value ? pvData?.display?.precision : p.precision?.value;

  let displayValue = pvData?.value;

  if (mode === RUNTIME_MODE && typeof pvData?.value === "number") {
    if (typeof precision === "number" && precision > 0) {
      displayValue = pvData.value.toFixed(precision);
    }
  } else if (mode !== RUNTIME_MODE) {
    displayValue = p.pvName?.value ?? p.label?.value ?? "";
  }

  return (
    <AlarmBorder alarmData={pvData?.alarm} enable={p.alarmBorder?.value ?? true}>
      <div>
        <TextOutput
          pv="test:ai"
          usePvLabel={true}
          usePvPrecision={true}
          usePvUnits={true}
          usePvMinMax={true}
          alarmSensitive={true}
        />
      </div>
    </AlarmBorder>
  );
};

export { TestRASComp };
