export function appDefaultStyle(args = {}, ignore = {}) {
  const style = {};
  ignore.height || (style.height = "100%");
  ignore.width || (style.width = "100%");
  ignore.position || (style.position = "relative");
  ignore.left || (style.left = 0);
  ignore.right || (style.right = 0);
  ignore.bottom || (style.bottom = 0);
  ignore.top || (style.top = 0);
  ignore.margin || (style.margin = 0);
  ignore.marginTop || (style.marginTop = 0);
  ignore.marginLeft || (style.marginLeft = 0);
  ignore.marginRight || (style.marginRight = 0);
  ignore.marginBottom || (style.marginBottom = 0);
  ignore.marginHorizontal || (style.marginHorizontal = 0);
  ignore.marginVertical || (style.marginVertical = 0);
  ignore.margin || (style.margin = 0);
  return { ...style, ...args };
}
