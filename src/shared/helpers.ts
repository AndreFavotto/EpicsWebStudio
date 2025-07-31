export function mapHAlign(value: string | undefined): "flex-start" | "center" | "flex-end" {
  switch (value) {
    case "center":
      return "center";
    case "right":
      return "flex-end";
    default:
      return "flex-start";
  }
}

export function mapVAlign(value: string | undefined): "flex-start" | "center" | "flex-end" {
  switch (value) {
    case "middle":
      return "center";
    case "bottom":
      return "flex-end";
    default:
      return "flex-start";
  }
}
