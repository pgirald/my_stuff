import React from "react";
import { View } from "react-native";
import { getAppStyle } from "../Styles/AppStyle";

export const AppView = ({ children, style = {}, args = {} }) => {
  args.heightRelativeToWindow =
    (args.heightRelativeToWindow === true ||
    args.heightRelativeToWindow === false)
      ? args.heightRelativeToWindow
      : true;
  return (
    <View
      style={{
        ...getAppStyle(style, args),
        alignSelf: style.alignSelf || "center",
      }}
    >
      {children}
    </View>
  );
};
