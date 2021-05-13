import { appColors } from "../Styles/Colors";

export const modalButtonStyle = (style = {}) => {
  return {
    backgroundColor: appColors.doveGray,
    height: style.height || "4%",
    width: style.width || 150,
    marginHorizontal: style.marginHorizontal || 5,
    alignSelf: "flex-end",
  };
};
