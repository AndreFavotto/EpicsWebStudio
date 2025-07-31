export const COLORS = {
  titleBarColor: getComputedStyle(document.documentElement, null).getPropertyValue("--title-bar-color").trim(),
  backgroundColor: getComputedStyle(document.documentElement, null).getPropertyValue("--background-color").trim(),
  textColor: getComputedStyle(document.documentElement, null).getPropertyValue("--text-color").trim(),
  buttonColor: getComputedStyle(document.documentElement, null).getPropertyValue("--button-color").trim(),
  labelColor: getComputedStyle(document.documentElement, null).getPropertyValue("--label-color").trim(),
  inputColor: getComputedStyle(document.documentElement, null).getPropertyValue("--input-color").trim(),
  readColor: getComputedStyle(document.documentElement, null).getPropertyValue("--read-color").trim(),
  lightGray: getComputedStyle(document.documentElement, null).getPropertyValue("--light-gray").trim(),
  gridLineColor: getComputedStyle(document.documentElement, null).getPropertyValue("--grid-line-color").trim(),
  transparent: getComputedStyle(document.documentElement, null).getPropertyValue("--transparent").trim(),
};

export const EDIT_MODE = "edit";
export const RUNTIME_MODE = "runtime";
export const PVWS_URL = "ws://localhost:8080/pvws/pv";
export type Mode = typeof EDIT_MODE | typeof RUNTIME_MODE;
export const WIDGET_SELECTOR_WIDTH = 200; //px
export const PROPERTY_EDITOR_WIDTH = 320; //px
export const MIN_WIDGET_ZINDEX = 1;
export const MAX_WIDGET_ZINDEX = 10;
export const GRID_ID = "__grid__";
