export const DEFAULT_COLORS = {
  "backgroundColor": getComputedStyle(document.documentElement,null).getPropertyValue('--background-color').trim(),
  "textColor": getComputedStyle(document.documentElement,null).getPropertyValue('--text-color').trim(),
  "buttonColor": getComputedStyle(document.documentElement,null).getPropertyValue('--button-color').trim(),
  "labelColor": getComputedStyle(document.documentElement,null).getPropertyValue('--label-color').trim(),
  "inputColor": getComputedStyle(document.documentElement,null).getPropertyValue('--input-color').trim(),
  "lightGray": getComputedStyle(document.documentElement,null).getPropertyValue('--light-gray').trim(),
  "gridLineColor": getComputedStyle(document.documentElement,null).getPropertyValue('--grid-line-color').trim(),
};