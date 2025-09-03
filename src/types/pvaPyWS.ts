export type WSMessageType = "update" | "subscribe" | "unsubscribe" | "write";
export type PVValue = number | number[] | string | string[];

interface Alarm {
  severity: number;
  status: number;
  message: string;
}

interface TimeStamp {
  secondsPastEpoch: number;
  nanoseconds: number;
  userTag: number;
}

interface Display {
  limitLow?: number;
  limitHigh?: number;
  description?: string;
  units?: string;
  precision?: number;
  form?: string;
  choices?: string[];
}

interface Control {
  limitLow?: number;
  limitHigh?: number;
  minStep?: number;
}

interface ValueAlarm {
  active?: boolean;
  lowAlarmLimit?: number;
  lowWarningLimit?: number;
  highWarningLimit?: number;
  highAlarmLimit?: number;
  lowAlarmSeverity?: number;
  lowWarningSeverity?: number;
  highWarningSeverity?: number;
  highAlarmSeverity?: number;
  hysteresis?: number;
}

export interface WSMessage {
  pv: string;
  type: WSMessageType;
  value?: PVValue;
  alarm?: Alarm;
  timeStamp?: TimeStamp;
  display?: Display;
  control?: Control;
  valueAlarm?: ValueAlarm;
  raw?: [Record<string, unknown>];
  b64dbl?: string;
  b64flt?: string;
  b64int?: string;
  b64srt?: string;
  b64byt?: string;
}

export interface PVData {
  name: string;
  value: PVValue;
  alarm?: Alarm;
  timeStamp?: TimeStamp;
  display?: Display;
  control?: Control;
  valueAlarm?: ValueAlarm;
}

export type MultiPvData = Record<string, PVData>;
