import React, { useEffect, useState, useRef } from "react";
import type { WidgetUpdate } from "../../../types/widgets";
import Plot from "react-plotly.js";
import { useEditorContext } from "../../../context/useEditorContext";
import { COLORS, EDIT_MODE } from "../../../constants/constants";
import { XAxisPVLabel, YAxisPVLabel } from "./Plot";

function usePrev<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

const PlotComp: React.FC<WidgetUpdate> = ({ data }) => {
  const { mode } = useEditorContext();
  const inEditMode = mode === EDIT_MODE;
  const prevInEditMode = usePrev(inEditMode);
  const p = data.editableProperties;
  const bufferSize = p.plotBufferSize?.value ?? 50;

  const [yBuffer, setYBuffer] = useState<number[]>([]);
  const [xBuffer, setXBuffer] = useState<number[]>([]);

  const yPVName = p.pvNames?.value?.[YAxisPVLabel];
  const xPVName = p.pvNames?.value?.[XAxisPVLabel];

  const yVal = yPVName ? data.multiPvData?.[yPVName]?.value : undefined;
  const xVal = xPVName ? data.multiPvData?.[xPVName]?.value : undefined;

  // --- Y effect
  useEffect(() => {
    if (prevInEditMode !== undefined && prevInEditMode !== inEditMode) {
      setYBuffer([]);
      setXBuffer([]);
    }

    if (inEditMode) {
      setYBuffer([10, 15, 13, 17]);
      setXBuffer([0, 1, 2, 3]);
      return;
    }

    if (typeof yVal === "number") {
      setYBuffer((prev) => {
        const next = [...prev, yVal];
        if (next.length > bufferSize) next.shift();
        return next;
      });
    } else if (Array.isArray(yVal) && yVal.every((v) => typeof v === "number")) {
      setYBuffer(yVal);
    }
  }, [yVal, inEditMode, prevInEditMode, bufferSize]);

  // --- X effect
  useEffect(() => {
    if (inEditMode) return;

    if (typeof xVal === "number") {
      setXBuffer((prev) => {
        const next = [...prev, xVal];
        if (next.length > bufferSize) next.shift();
        return next;
      });
    } else if (Array.isArray(xVal) && xVal.every((v) => typeof v === "number")) {
      setXBuffer(xVal);
    }
  }, [xVal, inEditMode, bufferSize]);

  return (
    <div
      style={{
        width: p.width?.value,
        height: p.height?.value,
        borderRadius: p.borderRadius?.value,
        borderStyle: p.borderStyle?.value,
        borderWidth: p.borderWidth?.value,
        borderColor: p.borderColor?.value,
        display: "flex",
      }}
    >
      <Plot
        data={[
          {
            x: xBuffer.length ? xBuffer : undefined,
            y: yBuffer.length ? yBuffer : undefined,
            type: "scatter",
            mode: p.plotLineStyle?.value ?? "lines+markers",
            marker: { color: p.lineColor?.value },
          },
        ]}
        layout={{
          title: {
            text: p.plotTitle?.value,
            font: {
              family: p.fontFamily?.value,
              size: p.fontSize?.value,
              weight: p.fontBold?.value ? 800 : 0,
              style: p.fontItalic?.value ? "italic" : "normal",
            },
          },
          xaxis: {
            title: {
              text: p.xAxisTitle?.value,
              font: {
                family: p.fontFamily?.value,
                size: (p.fontSize?.value ?? 12) - 2,
                color: COLORS.lightGray,
              },
            },
          },
          yaxis: {
            type: p.logscaleY?.value ? "log" : "linear",
            title: {
              text: p.yAxisTitle?.value,
              font: {
                family: p.fontFamily?.value,
                size: (p.fontSize?.value ?? 12) - 2,
                color: COLORS.lightGray,
              },
            },
          },
          paper_bgcolor: p.backgroundColor?.value,
          plot_bgcolor: p.backgroundColor?.value,
          dragmode: inEditMode ? false : "zoom",
          clickmode: inEditMode ? "none" : "event",
          margin: { b: 50, l: 50, t: 50, r: 30 },
          width: p.width?.value,
          height: p.height?.value,
        }}
        config={{
          responsive: true,
          modeBarButtonsToRemove: ["zoom2d", "lasso2d", "zoomIn2d", "zoomOut2d", "select2d", "autoScale2d"],
          displaylogo: false,
        }}
      />
    </div>
  );
};

export { PlotComp };
