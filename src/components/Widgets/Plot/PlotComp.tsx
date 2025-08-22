import React, { useEffect, useState, useRef } from "react";
import type { WidgetUpdate } from "../../../types/widgets";
import Plot from "react-plotly.js";
import { useEditorContext } from "../../../context/useEditorContext";
import { COLORS, EDIT_MODE } from "../../../constants/constants";

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
  const bufferSize = p.plotBufferSize?.value ?? 50; // fixed number of points

  const [yBuffer, setYBuffer] = useState<number[]>([]);
  const [xBuffer, setXBuffer] = useState<number[]>([]);

  // update Y values
  useEffect(() => {
    if (prevInEditMode !== undefined && prevInEditMode !== inEditMode) {
      setYBuffer([]); // reset buffer on mode transition
      setXBuffer([]); // reset buffer on mode transition
    }
    const value = p.pvValue?.value;
    if (inEditMode) {
      setYBuffer([10, 15, 13, 17]); // illustrative default
    } else if (Array.isArray(value)) {
      setYBuffer(value); // direct use of array
    } else if (typeof value === "number") {
      setYBuffer((prev) => {
        const next = [...prev, value];
        if (next.length > bufferSize) next.shift();
        return next;
      });
    }
  }, [p.pvValue?.value, inEditMode, prevInEditMode, bufferSize]);

  // update X values
  useEffect(() => {
    if (inEditMode) return;
    const value = p.xAxisPVValue?.value;
    if (Array.isArray(value)) {
      setXBuffer(value);
    } else if (typeof value === "number") {
      setXBuffer((prev) => {
        const next = [...prev, value];
        if (next.length > bufferSize) next.shift();
        return next;
      });
    }
  }, [p.xAxisPVValue?.value, inEditMode, bufferSize]);

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
