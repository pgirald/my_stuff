export function styleMapper(style) {
  return {
    height: style.height || 100,
    width: style.width || 100,
    alignSelf: style.alignSelf,
    position: style.position,
    left: style.left,
    right: style.right,
    bottom: style.bottom,
    top: style.top,
    margin: style.margin,
    marginTop: style.marginTop,
    marginLeft: style.marginLeft,
    marginRight: style.marginRight,
    marginBottom: style.marginBottom,
    marginHorizontal: style.marginHorizontal,
    marginVertical: style.marginVertical,
  };
}
