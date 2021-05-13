import React from "react";
import { View } from "react-native";
import { appColors } from "../Styles/Colors";

export const AppContainer = ({ children, style = {} }) => {
  return (
    <View
      style={{
        ...style,
        height: style.height || "100%",
        width: style.width || "100%",
        backgroundColor: style.backgroundColor || appColors.white,
      }}
    >
      {children}
    </View>
  );
};
