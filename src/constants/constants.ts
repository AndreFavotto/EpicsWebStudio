import type { CSSProperties } from "react";

/* grouped by shade similarity to be shown as a pallete */
export const COLORS = {
  // Darker
  textColor: getComputedStyle(document.documentElement).getPropertyValue("--text-color").trim(),
  titleBarColor: getComputedStyle(document.documentElement).getPropertyValue("--title-bar-color").trim(),
  graphLineColor: getComputedStyle(document.documentElement).getPropertyValue("--graph-line-color").trim(),
  midDarkBlue: getComputedStyle(document.documentElement).getPropertyValue("--mid-dark-blue").trim(),

  // Status / highlights
  highlighted: getComputedStyle(document.documentElement).getPropertyValue("--highlighted").trim(),
  onColor: getComputedStyle(document.documentElement).getPropertyValue("--on-color").trim(),
  offColor: getComputedStyle(document.documentElement).getPropertyValue("--off-color").trim(),

  // Neutrals / base
  backgroundColor: getComputedStyle(document.documentElement).getPropertyValue("--background-color").trim(),
  inputColor: getComputedStyle(document.documentElement).getPropertyValue("--input-color").trim(),
  readColor: getComputedStyle(document.documentElement).getPropertyValue("--read-color").trim(),
  lightGray: getComputedStyle(document.documentElement).getPropertyValue("--light-gray").trim(),
  gridLineColor: getComputedStyle(document.documentElement).getPropertyValue("--grid-line-color").trim(),
  buttonColor: getComputedStyle(document.documentElement).getPropertyValue("--button-color").trim(),
  labelColor: getComputedStyle(document.documentElement).getPropertyValue("--label-color").trim(),
};

export const BACK_UI_ZIDX = parseInt(
  getComputedStyle(document.documentElement, null).getPropertyValue("--back-ui-zidx")
);
export const FRONT_UI_ZIDX = parseInt(
  getComputedStyle(document.documentElement, null).getPropertyValue("--front-ui-zidx")
);

export const APP_SRC_URL = "https://github.com/AndreFavotto/epicsWebStudio";
export const EDIT_MODE = "edit";
export const RUNTIME_MODE = "runtime";
export const WS_URL = "ws://localhost:8080";
export type Mode = typeof EDIT_MODE | typeof RUNTIME_MODE;
export const WIDGET_SELECTOR_WIDTH = 200; //px
export const PROPERTY_EDITOR_WIDTH = 320; //px
export const GRID_ID = "__grid__";
export const MAX_HISTORY = 100; // history of actions for undo/redo
export const MAX_ZOOM = 100;
export const MIN_ZOOM = 0.2;
export const FLEX_ALIGN_MAP: Record<string, CSSProperties["justifyContent"]> = {
  left: "flex-start",
  center: "center",
  right: "flex-end",
  top: "flex-start",
  middle: "center",
  bottom: "flex-end",
};
export const INPUT_TEXT_ALIGN_MAP: Record<string, CSSProperties["textAlign"]> = {
  left: "left",
  center: "center",
  right: "right",
};
