export type PVWSMessageType = "update" | "ping" | "subscribe" | "clear" | "list" | "write";
export type PVWSMessageValue = number | string | boolean | number[];
export interface PVWSMessage {
  type: PVWSMessageType;
  pv: string;

  /** Whether the PV is read-only (may appear only when state changes). */
  readonly?: boolean;

  /** The current value (for simple VNumber or VEnum). */
  value?: PVWSMessageValue;

  /** Text representation of the value (for VString or VEnum). */
  text?: string;

  /** Optional numeric array values encoded as Base64. */
  b64dbl?: string; // Base64 double array
  b64flt?: string; // Base64 float array
  b64int?: string; // Base64 int array
  b64srt?: string; // Base64 short array
  b64byt?: string; // Base64 byte array

  /** VType type name, e.g., "VDouble", "VString", "VEnum". */
  vtype?: string;

  /** Severity state, e.g., "NONE", "MINOR", "MAJOR". */
  severity?: string;

  /** Display and formatting information. */
  units?: string;
  description?: string;
  precision?: number;
  min?: number;
  max?: number;
  warn_low?: number;
  warn_high?: number;
  alarm_low?: number;
  alarm_high?: number;

  /** Enum labels (only for VEnum). */
  labels?: string[];

  /** Timestamp of the value. */
  seconds?: number;
  nanos?: number;

  /** Allow extra properties (future extensions). */
  [key: string]: unknown;
}
