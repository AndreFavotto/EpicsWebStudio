import React from "react";
import type { ReactNode, CSSProperties } from "react";
import type { Alarm } from "../../types/pvaPyWS";
import { COLORS } from "../../constants/constants";

interface AlarmBorderProps {
  alarmData?: Alarm;
  children: ReactNode;
  enable: boolean | undefined;
}

/**
 * AlarmBorder wraps any widget and applies a border color based on PV alarm severity.
 * - Defaults to COLORS.disconnected if PV hasn't been read yet.
 * - Severity → Color mapping:
 *   - NO_ALARM → no border
 *   - MINOR → COLORS.minor
 *   - MAJOR → COLORS.major
 *   - INVALID → COLORS.invalid
 */
const AlarmBorder: React.FC<AlarmBorderProps> = ({ alarmData, children, enable }) => {
  const getBorderColor = (): string | null => {
    if (!alarmData) return null; // disconnected, no border
    switch (alarmData.severity) {
      case 0: // NO_ALARM
        return null;
      case 1: // MINOR
        return COLORS.minor;
      case 2: // MAJOR
        return COLORS.major;
      case 3: // INVALID
        return COLORS.invalid;
      default:
        return null;
    }
  };

  const borderColor = getBorderColor();

  const style: CSSProperties = {
    width: "100%",
    height: "100%",
    border: borderColor ? `4px ${borderColor === COLORS.disconnected ? "dashed" : "solid"} ${borderColor}` : undefined,
    borderRadius: "2px",
    boxSizing: "border-box",
  };

  return enable ? (
    <div style={style} title={alarmData?.message}>
      {children}
    </div>
  ) : (
    children
  );
};

export default AlarmBorder;
