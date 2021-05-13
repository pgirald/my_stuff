import { Dimensions } from "react-native";

function getPercentage(str) {
  let chars = Array.from(str);
  chars.pop();
  return Number(chars.join(""));
}

export function getWidthRelativeToWindow(width) {
  if (typeof width === "string" && width[width.length - 1] === "%") {
    let percentage = getPercentage(width);
    return (percentage / 100) * Dimensions.get("screen").width;
  }
  return width;
}

export function getHeightRelativeToWindow(height) {
  if (typeof height === "string" && height[height.length - 1] === "%") {
    let percentage = getPercentage(height);
    return (percentage / 100) * Dimensions.get("screen").height;
  }
  return height;
}
