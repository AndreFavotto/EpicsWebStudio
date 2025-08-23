from dataclasses import dataclass, asdict
from typing import Optional, Union, List
from pvaccess import PvObject
import math
import base64
import numpy as np

@dataclass
class Alarm:
    severity: int = 0
    status: int = 0
    message: str = "NO_ALARM"

@dataclass
class TimeStamp:
    secondsPastEpoch: int = 0
    nanoseconds: int = 0
    userTag: int = 0

@dataclass
class Display:
    limitLow: Optional[float] = None
    limitHigh: Optional[float] = None
    description: Optional[str] = None
    units: Optional[str] = None
    precision: Optional[int] = None
    form: Optional[str] = None
    choices: Optional[list] = None

@dataclass
class Control:
    limitLow: Optional[float] = None
    limitHigh: Optional[float] = None
    minStep: Optional[float] = None

@dataclass
class ValueAlarm:
    active: Optional[bool] = None
    lowAlarmLimit: Optional[float] = None
    lowWarningLimit: Optional[float] = None
    highWarningLimit: Optional[float] = None
    highAlarmLimit: Optional[float] = None
    lowAlarmSeverity: Optional[int] = None
    lowWarningSeverity: Optional[int] = None
    highWarningSeverity: Optional[int] = None
    highAlarmSeverity: Optional[int] = None
    hysteresis: Optional[int] = None

@dataclass
class PVValue:
    value: Optional[Union[float, List[float], List[int], List[str]]] = None
    alarm: Optional[Alarm] = None
    timeStamp: Optional[TimeStamp] = None
    display: Optional[Display] = None
    control: Optional[Control] = None
    valueAlarm: Optional[ValueAlarm] = None
    raw: Optional[dict] = None
    b64dbl: Optional[str] = None
    b64flt: Optional[str] = None
    b64int: Optional[str] = None
    b64srt: Optional[str] = None
    b64byt: Optional[str] = None

def encode_base64_array(array, dtype):
    arr = np.asarray(array, dtype=dtype)
    # Ensure little-endian (PVWS requirement)
    if not arr.dtype.isnative or arr.dtype.byteorder != "<":
        arr = arr.astype("<" + arr.dtype.str[1:])
    return base64.b64encode(arr.tobytes()).decode("ascii")

def parse_pv(pv_obj: PvObject) -> PVValue:
    pv_dict = pv_obj.get()
    value = pv_dict.get("value")
    b64dbl = b64flt = b64int = b64srt = b64byt = None

    # Handle arrays efficiently
    if isinstance(value, (list, np.ndarray)) and len(value) > 0:
        arr = np.asarray(value)
        if np.issubdtype(arr.dtype, np.floating):
            b64dbl = encode_base64_array(arr, np.float64)
            value = None
        elif np.issubdtype(arr.dtype, np.integer):
            if arr.min() >= -128 and arr.max() <= 255:
                b64byt = encode_base64_array(arr, np.uint8)
            elif arr.min() >= -32768 and arr.max() <= 32767:
                b64srt = encode_base64_array(arr, np.int16)
            else:
                b64int = encode_base64_array(arr, np.int32)
            value = None

    # Alarm
    alarm = None
    if "alarm" in pv_dict:
        a = pv_dict["alarm"]
        alarm = Alarm(a.get("severity", 0), a.get("status", 0), a.get("message", "NO_ALARM"))

    # TimeStamp
    timestamp = None
    if "timeStamp" in pv_dict:
        ts = pv_dict["timeStamp"]
        timestamp = TimeStamp(ts.get("secondsPastEpoch", 0), ts.get("nanoseconds", 0), ts.get("userTag", 0))

    # Display
    display = None
    if "display" in pv_dict:
        d = pv_dict["display"]
        display = Display(d.get("limitLow"), d.get("limitHigh"), d.get("description"),
                          d.get("units"), d.get("precision"), d.get("form"), d.get("choices"))

    # Control
    control = None
    if "control" in pv_dict:
        c = pv_dict["control"]
        control = Control(c.get("limitLow"), c.get("limitHigh"), c.get("minStep"))

    # ValueAlarm
    value_alarm = None
    if "valueAlarm" in pv_dict:
        va = pv_dict["valueAlarm"]
        def safe_get(k):
            val = va.get(k)
            return None if isinstance(val, float) and math.isnan(val) else val
        value_alarm = ValueAlarm(
            active=va.get("active"),
            lowAlarmLimit=safe_get("lowAlarmLimit"),
            lowWarningLimit=safe_get("lowWarningLimit"),
            highWarningLimit=safe_get("highWarningLimit"),
            highAlarmLimit=safe_get("highAlarmLimit"),
            lowAlarmSeverity=va.get("lowAlarmSeverity"),
            lowWarningSeverity=va.get("lowWarningSeverity"),
            highWarningSeverity=va.get("highWarningSeverity"),
            highAlarmSeverity=va.get("highAlarmSeverity"),
            hysteresis=va.get("hysteresis")
        )

    return PVValue(
        value=value,
        alarm=alarm,
        timeStamp=timestamp,
        display=display,
        control=control,
        valueAlarm=value_alarm,
        raw=pv_dict,
        b64dbl=b64dbl,
        b64flt=b64flt,
        b64int=b64int,
        b64srt=b64srt,
        b64byt=b64byt
    )
