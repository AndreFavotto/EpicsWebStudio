export const DEFAULT_COLORS = {
  titleBarColor: getComputedStyle(document.documentElement, null).getPropertyValue("--title-bar-color").trim(),
  backgroundColor: getComputedStyle(document.documentElement, null).getPropertyValue("--background-color").trim(),
  textColor: getComputedStyle(document.documentElement, null).getPropertyValue("--text-color").trim(),
  buttonColor: getComputedStyle(document.documentElement, null).getPropertyValue("--button-color").trim(),
  labelColor: getComputedStyle(document.documentElement, null).getPropertyValue("--label-color").trim(),
  inputColor: getComputedStyle(document.documentElement, null).getPropertyValue("--input-color").trim(),
  readColor: getComputedStyle(document.documentElement, null).getPropertyValue("--read-color").trim(),
  lightGray: getComputedStyle(document.documentElement, null).getPropertyValue("--light-gray").trim(),
  gridLineColor: getComputedStyle(document.documentElement, null).getPropertyValue("--grid-line-color").trim(),
};

export const EDIT_MODE = "edit";
export const RUNTIME_MODE = "runtime";

export type Mode = typeof EDIT_MODE | typeof RUNTIME_MODE;
