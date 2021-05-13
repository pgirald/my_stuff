import {
  getHeightRelativeToWindow,
  getWidthRelativeToWindow,
} from "../../Utils/General/WindowDimensions";

export function getAppStyle(style, args) {
  let appStyle = style;
  let height = style.height;
  let width = style.width;
  if (args.heightRelativeToWindow) {
    height = getHeightRelativeToWindow(height);
  }
  if (args.widthRelativeToWindow) {
    width = getWidthRelativeToWindow(width);
  }
  if (args.heightRelativeToWindow || args.widthRelativeToWindow) {
    appStyle = { ...style, height: height, width: width };
  }
  return appStyle;
}
